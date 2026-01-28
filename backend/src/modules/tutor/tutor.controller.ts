import type { Request, Response } from "express"
import { catchAsync } from "../../utils/asyncHandler"
import TutorService from "./tutor.service"

class TutorController {
   public createOrUpdateProfile = catchAsync(async (req: Request, res: Response) => {
       const service = new TutorService()
       const result = await service.createOrUpdateProfile(req.user.id, req.body)
       return res.status(200).json(result)
   })
}

export default TutorController