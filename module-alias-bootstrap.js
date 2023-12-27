const moduleAlias = require('module-alias')

const outputPath = __dirname+"/dist/smart-savings-api"

moduleAlias.addAliases({
    "@infrastructure": outputPath+"/src/infrastructure",
    "@application": outputPath+"/src/application",
    "@domain": outputPath+"/src/domain",

    "@Session/infrastructure": outputPath+"/src/infrastructure/modules/Session/infrastructure",
    "@Session/application": outputPath+"/src/infrastructure/modules/Session/application",
    "@Session/domain": outputPath+"/src/infrastructure/modules/Session/domain"
})

moduleAlias()