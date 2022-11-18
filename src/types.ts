
export type Account={
   id : number,
   name: string,
   cpf: string,
   birth_date: string,
   balance:number,
   statement: Transaction[]
}

export type Transaction={
   id : number,
   value:number,
}

