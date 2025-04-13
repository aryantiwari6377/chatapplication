export const logout = (req,res)=>{
    try{
          res.status(200).json({message:"logout successfull"});
    }
    catch(error){
      res.status(500).json({error});
    }
};