import db from "../db/db.js";


export const getLeaderBoardData = async(req, res) => {
    try {
        let users = await db.user.findMany({
          orderBy: {
            reward: 'desc', 
          },
        });

        users = users.map(data => {
            return({
                firstName: data.firstName,
                reward: data.reward
            })
        })
    
        return res.status(200).json({data: users});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMsg: 'Error fetching users' });
      }
}


export const handleDailyUserbonus = async (req, res) => {
    try {
        const { id, rewardAmount } = req.body;
        if(!id){
          return res.status(500).json({ errorMsg: 'Server error', devMsg: "Id not present" });
        }
        let updatedUser = await db.user.update({
            where: { id },
            data: {
                reward: {
                    increment: rewardAmount ?? 100, 
                },
            },
        });

        return res.status(200).json({user: updatedUser});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMsg: 'Error updating user bonus' });
    }
};
