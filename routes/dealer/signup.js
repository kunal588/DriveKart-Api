var express= require('express')
const router = express.Router();
const Dealer = require('../../schema/dealer')
router.post('/signup', async(req,res)=>{
    try{
        const new_dealer = new Dealer({
            username: req.body.name,
            password: req.body.desc,
            email: req.body.logo,
            name: req.body.role,
            mobile: req.body.mobile,
            material: req.body.material,
            weight: req.body.weight,
            quantity: req.body.quantity,
            state:req.body.state,
            city: req.body.city,
            booked:[],
        });
        var error_json={}
        new_dealer.save( async(error)=>{
              if(error){
                  if(error.errors['username']){
                    error_json.username=error.errors['username'].message;
                  }if(error.errors['password']){
                    error_json.password=error.errors['password'].message;
                  }if(error.errors['email']){
                    error_json.email=error.errors['email'].message;
                  }if(error.errors['weight']){
                    error_json.weight=error.errors['weight'].message;
                  }if(error.errors['quantity']){
                    error_json.quantity=error.errors['quantity'].message;
                  }
              }
              res.send(error_json)
        })

    }
    catch(err){
         console.log('error while dealer signup');
    }
})

module.exports = router

