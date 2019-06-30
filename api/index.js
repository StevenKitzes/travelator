const app = require('express')();

app.get('/', (req, res) => {
    return res.send('hi little bird!');
});

app.listen(8080, ()=>{
    console.log('Application listening on port 8080');
})