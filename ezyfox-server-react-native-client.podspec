require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ezyfox-server-react-native-client"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/youngmonkeys/ezyfox-server-react-native-client.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,c,cpp}"

  s.dependency "React-Core"
end
