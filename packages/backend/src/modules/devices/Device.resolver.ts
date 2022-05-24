import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  Args,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { connectionFromRelation } from "Relay/Connection.factory";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Device from "Modules/devices/Device.entity";
import User from "Modules/users/User.entity";
import { DeviceConnection } from "Modules/devices/Device.connection";

@Resolver(() => Device)
export default class DeviceResolver {
  @InjectRepository(Device, "prod")
  private readonly repository!: Repository<Device>;

  @Authorized(["ANY"])
  @FieldResolver(() => User)
  async user(@Root() device: Device, @Ctx() { db }: Context): Promise<User> {
    return await db.manager
      .createQueryBuilder()
      .relation(Device, "user")
      .of(device)
      .loadOne();
  }

  @Authorized(["USER"])
  @Query(() => DeviceConnection)
  async myDevices(
    @Args() args: ConnectionArguments,
    @Ctx() { db, user }: Context
  ): Promise<DeviceConnection> {
    return connectionFromRelation(args, db, User, "devices", user);
  }

  @Authorized("USER")
  @Query(() => Device)
  async myCurrentDevice(
    @Ctx() { device }: Context
  ): Promise<Device> {
    try {
      return device;
    } catch (error) {
      throw new UserInputError("No Device Found with this id");
    }
  }


  @Authorized(["USER"])
  @Mutation(() => Device)
  async deleteDevice(
    @Arg("deviceId") deviceId: string,
    @Ctx() { db }: Context
  ): Promise<Device> {
    try {
      const device = await db.manager.findOneOrFail(Device, deviceId);
      await db.manager.remove(device);
      return device;
    } catch (error) {
      throw new UserInputError("No Device Found with this id");
    }
  }
}
