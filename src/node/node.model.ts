import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
class WardenComponent {
    @Field(type => String)
    id: string

    @Field(type => String)
    serviceId: string

    @Field(type => String)
    ip: string 

    @Field(type => [String])
    permissions: string[]

    @Field(type => String)
    requestSecret: string

    @Field(type => String)
    tokenSecret: string
}

@ObjectType()
class WardenNode {
    @Field(type => String)
    id: string;

    @Field(type => String)
    host: string;

    @Field(type => [String])
    permissions: string[];

    @Field(type => String)
    requestSecret: string;

    @Field(type => String)
    tokenSecret: string;

    @Field(type => WardenComponent)
    components: WardenComponent[];
}


export { WardenComponent, WardenNode }