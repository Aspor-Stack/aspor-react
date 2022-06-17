import {
    Application,
    ODataClient,
    ODataEntity,
    ODataRequest,
    ODataResponse,
    ODataService,
    ODataSet
} from "@aspor/aspor-react/build";
import {
    Attachment,
    Board,
    BoardItem,
    BoardItemVote,
    Comment,
    Process,
    Project,
    Release, ReleaseState,
    RoadmapCategory,
    Subscription,
    Template,
    TemplateState,
    WebPushSubscription,
    WorkspaceRole
} from "./entities";
import {Guid} from "@aspor/aspor-react/build/libraries/odata/Guid";

export class TestService extends ODataService {

    constructor(app : Application) {
        super(new ODataClient("https://api.easyback.io/v1/08da0ff6-f0c4-4463-85eb-50987eb5c9ed"));
    }

    projects() : ODataSet<Project>
    projects(id : string) : ProjectEntity
    projects(id? : string) : any {
        return id ? new ProjectEntity(this,id,"projects"): new ODataSet(this,"projects");
    }

    items() : BoardItemSet
    items(id : string) : BoardItemEntity
    items(id? : string) : any {
        return id ? new BoardItemEntity(this,id,"items"): new BoardItemSet(this,"items");
    }

    templates() : ODataSet<Template>
    templates(id : string) : TemplateEntity
    templates(id? : string) : any {
        return id ? new TemplateEntity(this,id,"templates"): new ODataSet(this,"templates");
    }

    processes() : ODataSet<Process>
    processes(id : string) : ProcessEntity
    processes(id? : string) : any {
        return id ? new ProcessEntity(this,id,"processes"): new ODataSet(this,"processes");
    }

    comments() : CommentsSet
    comments(id : string) : CommentEntity
    comments(id? : string) : any {
        return id ? new CommentEntity(this,id,"comments"): new CommentsSet(this,"comments");
    }

    subscriptions() : SubscriptionSet
    subscriptions(id : string) : ODataEntity<Subscription>
    subscriptions(id? : string) : any {
        return id ? new ODataEntity(this,id,"subscriptions"): new SubscriptionSet(this,"subscriptions");
    }

    roles() : RolesSet
    roles(userId : string) : ODataEntity<WorkspaceRole>
    roles(userId? : string) : any {
        return userId ? new ODataEntity(this,userId,"roles"): new RolesSet(this,"roles");
    }

    webpushSubscriptions() : ODataSet<WebPushSubscription>
    webpushSubscriptions(endpoint : string) : ODataEntity<WebPushSubscription>
    webpushSubscriptions(endpoint? : string) : any {
        return endpoint ? new ODataEntity(this,endpoint,"webpushSubscriptions"): new ODataSet(this,"webpushSubscriptions");
    }
}


export class ProjectEntity extends ODataEntity<Project> {

    boards() : ODataSet<Board>
    boards(id : string) : BoardEntity
    boards(id? : string) : any {
        return id ? new BoardEntity(this,id,"boards"): new ODataSet(this,"boards");
    }

    releases() : ReleaseSet
    releases(id : string) : ODataEntity<Release>
    releases(id? : string) : any {
        return id ? new ODataEntity(this,id,"releases"): new ReleaseSet(this,"releases");
    }

    reset(){
        return this.action<Project>("reset",{});
    }

    icon(blob : Blob) : ODataRequest<ODataResponse & void>{
        return this.actionBinary<void>("icon",[blob]);
    }

    banner(blob : Blob) : ODataRequest<ODataResponse & void>{
        return this.actionBinary<void>("banner",[blob]);
    }
}

export class TemplateEntity extends ODataEntity<Template> {

    states() : ODataSet<TemplateState>
    states(id : string) : ODataEntity<TemplateState>
    states(id? : string) : any {
        return id ? new ODataEntity<TemplateState>(this,id,"states"): new ODataSet(this,"states");
    }

    boards() : ODataSet<Board>
    boards(id : string) : ODataEntity<Board>
    boards(id? : string) : any {
        return id ? new ODataEntity<Template>(this,id,"boards"): new ODataSet(this,"boards");
    }
}

export class ProcessEntity extends ODataEntity<Process> {

    clone(name : string){
        return this.action<Project>("clone",{name});
    }

    projects() : ODataSet<Project> {
        return new ODataSet(this,"projects");
    }

    releaseStates() : ODataSet<ReleaseState>
    releaseStates(id : string) : ODataEntity<ReleaseState>
    releaseStates(id? : string) : any {
        return id ? new ODataEntity(this,id,"releaseStates"): new ODataSet(this,"releaseStates");
    }

    roadmapCategories() : ODataSet<RoadmapCategory>
    roadmapCategories(id : string) : ODataEntity<RoadmapCategory>
    roadmapCategories(id? : string) : any {
        return id ? new ODataEntity(this,id,"roadmapCategories"): new ODataSet(this,"roadmapCategories");
    }
}

export class BoardEntity extends ODataEntity<Board> {

    items() : ODataSet<BoardItem>
    items(id : string) : BoardItemEntity
    items(id? : string) : any {
        return id ? new BoardItemEntity(this,id,"items"): new ODataSet(this,"items");
    }

}

export class BoardItemEntity extends ODataEntity<BoardItem> {

    vote() : ODataRequest<ODataResponse & BoardItemVote>{
        return this.action<BoardItemVote>("vote",{});
    }

    resetVotes() : ODataRequest<ODataResponse & BoardItemVote>{
        return this.action<BoardItemVote>("resetVotes",{});
    }

    pin() : ODataRequest<ODataResponse & BoardItemVote>{
        return this.action<BoardItemVote>("pin",{});
    }

    move(projectId: string, boardId: string): ODataRequest<any> {
        return this.action("move", {projectId, boardId})
    }

    markAsDuplicated(duplicatedOfId?: string): ODataRequest<any> {
        return this.action("markAsDuplicated", {duplicatedOfId: duplicatedOfId??null})
    }

    votes() : ODataSet<BoardItemVote> {
        return new ODataSet(this,"votes");
    }

    comments() : CommentsSet
    comments(id : string) : CommentEntity
    comments(id? : string) : any {
        return id ? new CommentEntity(this,id,"comments"): new CommentsSet(this,"comments");
    }

    attachments() : ODataSet<Attachment>
    attachments(id : string) : ODataEntity<Attachment>
    attachments(id? : string) : any {
        return id ? new ODataEntity<Attachment>(this,id,"attachments"): new ODataSet(this,"attachments");
    }
}

export class ReleaseSet extends ODataSet<Release> {

    changelog(){
        return this.function("changelog");
    }
}

export class BoardItemSet extends ODataSet<BoardItem> {

    forRoadmap(projectId: string, categoryId: string){
        return this.collectionFunction("forRoadmap",{projectId,categoryId});
    }
}

export class CommentEntity extends ODataEntity<Comment> {

    reactions() : any {
        return new ODataSet(this,"reactions");
    }

    attachments() : ODataSet<Attachment>
    attachments(id : string) : ODataEntity<Attachment>
    attachments(id? : string) : any {
        return id ? new ODataEntity<Attachment>(this,id,"attachments"): new ODataSet(this,"attachments");
    }
}

export class SubscriptionSet extends ODataSet<Subscription> {

    find(type : string,referenceId: string) : ODataRequest<ODataResponse & Subscription>{
        return this.function<Subscription>("find",{
            type: type,
            referenceId: Guid.new(referenceId)
        });
    }

   /*
    create(type : string,referenceId: string) : ODataRequest<ODataResponse & Subscription>{
        return this.action("subscribe",{
            type: type,
            referenceId: referenceId
        });
    }

    */
}

export class RolesSet extends ODataSet<WorkspaceRole> {

    grant(privilegesCode: string){
        return this.action("grant",{privilegesCode});
    }
}

export class CommentsSet extends ODataSet<Comment> {

}
