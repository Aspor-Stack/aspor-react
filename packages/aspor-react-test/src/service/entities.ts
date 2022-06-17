
export interface Workspace {

    name: string

    id: string

    tenantId: string

    projects: Project[] | null

    showPoweredBy: boolean

    singleProjectId?: string|null

    defaultTheme: string

    primaryColor: string

    secondaryColor: string

    images: WorkspaceImage[]
}

export interface WorkspaceImage {

    name: string

    type: string

    url: string

    sizes: string

    additionalText: boolean

}

export interface Project {

    id: string

    discriminator: string

    name: string

    iconUrl: string

    bannerUrl: string

    navigation: string

    description?: string

    shortDescription?: string

    boards: Board[]

    workspace: Workspace[]
}

export interface Board {

    id: string

    projectId: string

    name: string,

    singularName: string,

    discriminator: string,

    description: string,

    icon: string,

    useProjectDescription: boolean,

    project: Project

    templateId: string

    template: Template
}

export interface BoardItem {

    id: string

    boardId: string

    title: string

    stateId: string

    description: string

    tags: string

    data: string,

    voteCount: number,

    pined: boolean,

    state: TemplateState

    votes: BoardItemVote[]

    duplicatedOfId?: string

    modifiedOn: string

    createdOn: string

    createdBy: string

}

export interface BoardItemVote {

    id: string,

    itemId: string,

    userId: string,
}


export interface Release {

    id: string

    projectId: string

    name: string,

    description: string,

    project: Project
}

export interface Attachment {

    id: string,

    type: string,

    referenceId: string,

    name: string,

    cdnId: string,

    cdnUrl: string
}

export interface Process {

    id: string

    workspaceId: string

    name: string

}

export interface RoadmapCategory {

    id: string

    name: string

}

export interface Template {

    id: string

    workspaceId: string

    name: string

    components: string

    states: TemplateState[]

    attachmentsEnabled: boolean
}

export interface Comment {

    id: string

    type: string

    referenceId: string

    text: string

    system: boolean

    createdOn: string

    modifiedOn: string

    createdBy: string

    modifiedBy: string

    reactions: CommentReaction[]
}

export interface CommentReaction {

    id: string

    commentId: string

    emojiUnified: string

    createdOn: string

    createdBy: string
}

export interface User {

    id: string

    username: string

    discriminator: string

}

export interface TemplateState {

    id: string

    templateId: string

    name: string

    color: string

    isInitialize: boolean

    isActive: boolean

    index: number
}

export interface ReleaseState {

    id: string

    templateId: string

    name: string

    color: string

    isInitialize: boolean

    isVisibleOnChangelog: boolean

    isVisibleOnRoadmap: boolean

    index: number
}

export interface Subscription {

    type: string

    referenceId: string
}

export interface WorkspaceRole {

    id: string

    workspaceId: string

    userId: string

    role: string
}

export interface WebPushSubscription {

    endpoint: string

    p256dh: string

    auth: string

    expiration: string
}
