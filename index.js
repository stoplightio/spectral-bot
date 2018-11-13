const fs = require('fs')
const yaml = require('js-yaml')

const { Spectral } = require("@stoplight/spectral")
const { defaultRuleset } = require("@stoplight/spectral/lib/rulesets")


module.exports = (app) => {
  app.log('Yay! The app was loaded!')
  
  app.on(['pull_request.opened', 'pull_request.edited', 'pull_request.synchronize'], async context => {
    // remember that the config.yml file is the repo you are running the bot in
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
    const spectral = new Spectral({ rulesets: [defaultRuleset()] })

    // run!
    const results = spectral.run({ spec: 'oas2', target: content })

    context.github.issues.createComment(context.issue({ body: formatLintResults(results)}))
  })
}

const formatLintResults = lintResults => {
    let output = '## You have ' + lintResults.length + ' specification lint warnings and errors:'
    lintResults.forEach(result => {
      var { path, name, type, summary, severity, message } = result;
      path = path.join(" - ")      
      output += `
### ${path} \n **${name}** \n ${summary} \n 
<details><summary>More details</summary>${message}</details>
`
    }) 
  return output
}