class BrawlAPI
  require "json"

  def initialize(token)
    @token = token
    @base_url = "https://api.brawlapi.cf/v1"
  end

  def player(tag)
    request("/player?tag=#{tag}")
  end

  def battles(tag)
    request("/player/battlelog?tag=#{tag}")
  end

  private

  def request(endpoint)
    url = @base_url + endpoint
    response = `curl --silent --header 'Authorization: #{@token}' #{url}`
    JSON.parse(response)
  end
end
