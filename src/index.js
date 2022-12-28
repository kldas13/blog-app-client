
const mongoose = require('mongoose');
const port = 8000
const app = require('./app');
mongoose.connect('mongodb+srv://kldas13:kldas13@cluster0.behtklg.mongodb.net/blog_app?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.connection.once('open', () =>{
    console.log('connection established')
}).on('connectionError',(err) =>{
    console.log(err);
})

app.listen(port, () => console.log(`App listening on port ${port}!`));