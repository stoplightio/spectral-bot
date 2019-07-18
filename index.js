const fs = require('fs')
const yaml = require('js-yaml')

const { Spectral } = require("@stoplight/spectral")
const { oas2Functions, rules: oas2Rules } = require('@stoplight/spectral/dist/rulesets/oas2')

module.exports = (app) => {
  app.log('Yay! The app was loaded!')
  
  app.on(['pull_request.opened', 'pull_request.edited', 'pull_request.synchronize'], async context => {
    // remember: the config.yml file is the repo you are running the bot in
    const config = await context.config('config.yml')
    
    // currently, can only target one file
    const target = config.targetFiles.toString()
            
    const ref = await context.payload.pull_request.head.ref
    const contents = await context.github.repos.getContent(context.repo({
      path: target,
      ref: ref
    }))
    const text = Buffer.from(contents.data.content, 'base64').toString()      
    
    let content
    try {
      content = yaml.safeLoad(text)
    } catch (err) {
      context.github.issues.createComment(context.issue({ body: "Failed to load specficiation" }))
     }
    
    // create a new instance of spectral with all of the baked in rulesets
    const spectral = new Spectral()
    
    // leaving as OAS v2 for now, 
    // in Spectral 4.1 the JS API will be able to autodetect: https://github.com/stoplightio/spectral/issues/369    
    spectral.addFunctions(oas2Functions());
    oas2Rules()
      .then(rules => spectral.addRules(rules))
      .then(() => {
        // run!
        spectral.run(content).then(results => {
          context.github.issues.createComment(context.issue({ body: formatLintResults(results)}))
        })
      })
  })
}

const formatLintResults = lintResults => {
  let output = '## You have ' + lintResults.length + ' specification lint warnings and errors:\n'
    Object.keys(lintResults).forEach(function (key){
      var { path, code, severity, message, range} = lintResults[key]
      output += `**${path.join(' : ')}**\n Line: ${range.start.line}\n **${code}**\n ${message}\n\n`
     })  
     return output
}