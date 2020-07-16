# frozen_string_literal: true
require "json"

require_relative "lib/brawl_api"

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNjb3JkX3VzZXJfaWQiOiIzMTk" \
        "zMjMwOTcxNjM0OTc0NzIiLCJyZWFzb24iOiJQZXJzb25uYWwiLCJ2ZXJzaW9uIjoxLCJ" \
        "pYXQiOjE1NjkwODc0NTh9.UNR49QnwwHcFA85vyDwGYrE_9cD4VsAbzNvIUxK_gXE"

brawlAPI = BrawlAPI.new(TOKEN)

battles = brawlAPI.battles("9GC8JLRUV")["items"]

first, last = battles.minmax_by { |battle| battle["battleTime"] }


previous_last = IO.read(".last") rescue nil

File.open("battles", "a") do |file|
  battles.select { |battle| previous_last.nil? || battle["battleTime"] > previous_last }
         .sort_by { |battle| battle["battleTime"] }
         .each { |battle| file.puts JSON.dump(battle) }
         .tap { |ary| puts "Inserted #{ary.length} battles" }
end

IO.write(".last", last["battleTime"])
