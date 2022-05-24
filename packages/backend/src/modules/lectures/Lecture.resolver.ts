import { v4 as uuidv4 } from 'uuid';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Args,
  FieldResolver,
  Root,
  Ctx,
  Authorized,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { connectionFromEntities, connectionFromRepository } from "Relay/Connection.factory";
import { CreateLectureInput, UpdateLectureInput } from "Modules/lectures/Lecture.inputs";
import { UserInputError } from "apollo-server";

import Lecture from "Modules/lectures/Lecture.entity";
import User from "Modules/users/User.entity";
import Metadata from "Modules/metadatas/Metadata.entity";
import { LectureConnection } from "Modules/lectures/Lecture.connection";
import Context from "Interfaces/Context";
import { LectureRepository } from './Lecture.repository';

@Resolver(() => Lecture)
export default class LectureResolver {
  @InjectRepository(Lecture, "prod")
  private readonly repository!: Repository<Lecture>;

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => User, { nullable: true })
  async createdBy(@Root() lecture: Lecture): Promise<User> {
    return await this.repository
      .createQueryBuilder()
      .relation(Lecture, "createdBy")
      .of(lecture)
      .loadOne();
  }

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => Metadata)
  async metadata(@Root() lecture: Lecture): Promise<Metadata> {
    return await this.repository
      .createQueryBuilder()
      .relation(Lecture, "metadata")
      .of(lecture)
      .loadOne();
  }

  @Authorized("ADMIN")
  @Query(() => LectureConnection)
  async lectures(@Args() args: ConnectionArguments): Promise<LectureConnection> {

    return connectionFromRepository(args, this.repository);
  }

  @Authorized(["ADMIN", "USER"])
  @Query(() => LectureConnection)
  async library(@Args() args: ConnectionArguments, @Ctx() { db, user, device }: Context): Promise<LectureConnection> {

    return connectionFromEntities(await LectureRepository
      .getLecturesForUserDevice(user, device), args)
  }

  @Authorized(["ADMIN", "USER"])
  @Query(() => Lecture)
  async lectureById(@Arg("lectureId") lectureId: string, @Ctx() { user }: Context): Promise<Lecture> {
    try {
      const lecture = await this.repository.findOneOrFail(lectureId, { relations: ["createdBy"]});

      if (lecture.createdBy.id !== user.id) {
        throw new UserInputError("No Permissions");
      }

      return await lecture;
    } catch (error) {
      throw new UserInputError("No Lecture Found with this id");
    }
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => Lecture)
  async createLecture(
    @Arg("data") { metadata: {
      title,
      author,
      description,
      isbn,
      language,
      publisher,
      publishedAt,
    } }: CreateLectureInput,
    @Ctx() { user, device }: Context
  ): Promise<Lecture> {
    const uuid = uuidv4();
    const filename = `${uuid}.epub`;
    const filePath = `/cached-epubs/${uuid}.epub`;
    const coverPath = `/cached-covers/${uuid}.png`;

    const metadata = await Metadata.create({
      title,
      author,
      description: (description || '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''),
      isbn,
      language,
      publisher,
      publishedAt,
    });

    const lecture = await this.repository.create({
      filename,
      filePath,
      coverPath,
      metadata,
      createdBy: user,
      device,
    });

    await this.repository.save(lecture);
    return lecture;
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => Lecture)
  async updateLecture(
    @Arg("lectureId") lectureId: string,
    @Arg("data") input: UpdateLectureInput,
    @Ctx() { user } : Context,
  ): Promise<Lecture> {
    const lecture = await this.repository.findOneOrFail(lectureId, { relations: ["createdBy"]});
    
    if (lecture.createdBy.id !== user.id) {
      throw new UserInputError("No Permissions");
    }

    return await this.repository.save(this.repository.merge(lecture, input));
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => Lecture)
  async deleteLecture(@Arg("lectureId") lectureId: string, @Ctx() { user } : Context): Promise<Lecture> {
    try {
      const lecture = await this.repository.findOneOrFail(lectureId, { relations: ["createdBy"]});
    
      if (lecture.createdBy.id !== user.id) {
        throw new UserInputError("No Permissions");
      }

      await this.repository.remove(lecture);
      return lecture;
    } catch (error) {
      throw new UserInputError("No Lecture Found with this id");
    }
  }
}
