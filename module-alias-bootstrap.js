const moduleAlias = require('module-alias')

const outputPath = __dirname+"/dist/smart-savings-api"

moduleAlias.addAliases({
    "@infrastructure": outputPath+"/src/infrastructure",
    "@application": outputPath+"/src/application",
    "@domain": outputPath+"/src/domain"
})

moduleAlias()