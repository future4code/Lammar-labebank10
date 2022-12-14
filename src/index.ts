import express, {Request,Response} from "express"
import cors from 'cors'
import { users } from "./data"

const app = express()

app.use(express.json())
app.use(cors())

// Endpoint de criar usuário 

app.post("/users", (req:Request, res:Response) => {


  try {

    //Validação de idade

    const [day, month, year] =  req.body.birth_date.split('/')
    const birth_date = new Date(+year, +month -1, +day)
    const today = new Date()
    let age = today.getFullYear() - birth_date.getFullYear()
    const monthDifference = today.getMonth() - birth_date.getMonth()
    if(monthDifference < 0 || monthDifference === 0 && (today.getDate() - birth_date.getDate()) < 0){
      age--
    }

    if (age < 18) {
      const daysUntilAdult = Math.floor(6570 - ((today.getTime() - birth_date.getTime()) / 86400000) )
      throw new Error(`Você precisa ter 18 anos ou mais para abrir uma conta nesse banco`)
    }

    //Validação de CPF único

    if((users.filter((value) => value.cpf === req.body.cpf).length)){
      throw new Error("Já existe um usuário cadastrado com esse CPF.")
    }
    

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
  } catch (err:any) {
    res.status(401).send(err.message)
  }
})

app.get("/users", (req:Request, res:Response) => {
      res.send(users)
} )

app.get("/saldo", (req:Request, res:Response) => {

  try {
    if(!(req.body.cpf && req.body.name)){
      throw new Error("Você precisa fornecer seu cpf e nome para verificar seu saldo")
    }
    let saldo = (users.filter((conta) => req.body.cpf === conta.cpf && req.body.name === conta.name))[0].balance
    res.send(`Seu saldo é R$ ${saldo}`)
    
  } catch (err:any) {
    res.status(401).send(err.message)
  }


} )

app.patch("/saldo", (req:Request, res:Response) => {

  try {
    if(!(req.body.cpf && req.body.name && req.body.valor)){
      throw new Error("Você precisa fornecer seu cpf, nome e o valor do seu depósito para verificar seu saldo")
    }
    if(req.body.valor <= 0){
      throw new Error("O valor do depósito não pode ser igual ou menor que 0")
    }
    let accountIndex = users.findIndex((conta) => conta.cpf === req.body.cpf && conta.name === req.body.name)

    users[accountIndex].balance += req.body.valor
    
    res.send(`Seu saldo é R$ ${users[accountIndex].balance}`)
    
  } catch (err:any) {
    res.status(401).send(err.message)
  }
} )



app.listen('3003', () => {
  console.log("Server is running in http://localhost:3003");
});
