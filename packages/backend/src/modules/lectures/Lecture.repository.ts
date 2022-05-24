import { Service } from 'typedi';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import Device from "Modules/devices/Device.entity";
import User from "Modules/users/User.entity";
import Lecture from "./Lecture.entity";




@Service()
@EntityRepository(Lecture)
export class LectureRepository extends Repository<Lecture> {
  public static getLecturesForUserDevice(user: User, device: Device) {
    return getConnection('prod').getRepository(Lecture).createQueryBuilder("lectures")
      .where("lectures.createdById = :userId", { userId: user.id })
      .andWhere("lectures.deviceId = :deviceId", { deviceId: device.id })
      .getMany()
  }
}