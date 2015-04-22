#! /usr/bin/ruby

require 'httparty'

class EyeWire
  include HTTParty
  #extend HTTParty
  base_uri 'https://beta.eyewire.org'
  #debug_output

  def initialize
    @args = {verify: false}
  end

  def login
    login_response = self.class.get('/2.0/account/login?username=dgopstein&password=6oip*vQc5^QwO5', @args)

    @args.merge!(headers: {'Cookie' => login_response.request.options[:headers]["Cookie"]})

    #clients_response = self.class.get('/oauth2/1.0/clients/4', @args)


    login_response
  end

  def auth
    auth_response = self.class.get('/oauth2/1.0/auth?response_type=code&redirect_uri=http://eyewire-squads.herokuapp.com&client_id=4', @args)

    auth_response
  end

  def exchange(auth_code)
    exchange_response = self.class.post('/oauth2/1.0/exchange', @args.merge(body: {
      auth_code: auth_code,
      secret: 'M85MQeIZMyshv1PKVlFe26Eh8SKoVZhZwi5Yq12i4l3mCS2DovFE6qQRLViaJSVq4ZCPdWjlx7oJcO8S3QdKGi349ntnamDS3ZPUFnRUDJ5eZgjf0MM+QHaY+wOKBpkRpAXI8X8Tpo7VD5yqTqjt2VTL4U40UjkuNtFGoiRFdfw=',
      redirect_uri: 'http://eyewire-squads.herokuapp.com',
      client_id: 4,
      grant_type: 'authorization_code'
    }))
  end

  def account(access_token)
    self.class.get("/account?access_token=#{access_token}")
  end
end

ew = EyeWire.new

ew.login

puts "auth: #{ew.auth.inspect}"

