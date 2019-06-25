
const path = require ('path')
const express = require ('express')
const hbs = require ('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000 //heroku port

//Define paths for Express config

const publicDirectoryPhat = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')


//Setup hadlebars engine and view location
app.set('view engine','hbs') //handbars install
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory
app.use(express.static(publicDirectoryPhat))

app.get('', (req, res)=>{
    res.render('index',{      //index.hbs
    title: 'Weather',
    name: 'Enrico Castaldi'
    }) 
})

app.get ('/about',(req, res)=>{
    res.render('about',{
        title: 'About',
        name: 'Enrico Castaldi'
    })
})

app.get ('/help',(req, res)=>{
  res.render('help',{
      title: 'Help',
      name: 'Enrico Castaldi',
      message: 'How i can help you?'
  })
})


app.get('/weather', (req, res) =>{
    if(!req.query.address){
        return res.send({
            error: 'No Address Found'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={}) => {
        if (error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData)=>{
        if (error){
            return res.send({error})
        }

        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
        })
    })
  })
})


app.get('/products', (req, res) =>{
   if(!req.query.search){
     return res.send({
          error: 'No Search term!'
      })
   }

console.log(req.query.search)
res.send({
    products: []
})

})


app.get('/help/*',(req, res)=>{
    res.render('404',{
    title: 'Help Page',
    name: '',
    error: 'Help not Found!'
    })
})

app.get('*', (req, res) => {
   res.render('404',{
    title: '404',
    name: '',
    error: 'Page not Found!'
   })
})



app.listen(port, () =>{
    console.log('Server UP! on port ' + port)
})
