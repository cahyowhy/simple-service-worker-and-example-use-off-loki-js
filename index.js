const Express = require('express')
const app = new Express()
const PORT = 5100

app.use(Express.static(__dirname + '/public'))

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})
