const fs = require('fs')
const Map =
  process.env.REACT_APP_ENV === 'test'
    ? {
        PROJECT_UUID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
        PROJECT_CLIENT_KEY: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
        PROJECT_APP_UUID: '6b6a232e-973a-405c-969a-a546189fda16',
      }
    : {
        PROJECT_UUID: 'cb5e91db-f37b-4e53-8107-b97e36f78072',
        PROJECT_CLIENT_KEY: 'cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx',
        PROJECT_APP_UUID: 'f34c6ee8-a870-447e-aa86-3400c12c8f22',
      }
const filePath = './ios/ParticleNetwork-Info.plist'
const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PROJECT_APP_UUID</key>
  <string>${Map.PROJECT_APP_UUID}</string>
  <key>PROJECT_CLIENT_KEY</key>
  <string>${Map.PROJECT_CLIENT_KEY}</string>
  <key>PROJECT_UUID</key>
  <string>${Map.PROJECT_UUID}</string>
</dict>
</plist>`

fs.writeFileSync(filePath, content)

console.log('File written successfully.')
