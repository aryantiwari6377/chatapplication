import usermodel from "../../models/usermodel.js";

export const chatuserdetail = async(req,res)=>{
             const {id} = req.body;
             const author = req.user.id;
             const user = await usermodel.findById(id);
            if(!user){
                res.status(404).json({message:"user not found"});
            }
            res.status(200).json({user,author});
}
