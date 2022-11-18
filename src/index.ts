import express, {Request,Response} from "express"
import cors from 'cors'
import { users } from "./data"

const app = express()

app.use(express.json())
app.use(cors())

//Funcionalidade de criar conta 

app.post("/users", (req:Request, res:Response) => {

    
  const id = users.length+1
  
  users.push({
      id : id,
      name : req.body.name,
      cpf : req.body.cpf,
      birth_date : req.body.birth_date,
      balance : 0,
      statement : []
    }) 
    res.send(users.filter((value) =>  value.id === id  ))
} )

// app.get("/name" , (req:Request , res:Response) =>{          
    

//     const name = pessoas.map((pessoa)=>{
//       return pessoa.name
//     })
    
//     res.status(200).send(name)
//     })



app.listen('3003', () => {
  console.log("Server is running in http://localhost:3003");
});
