import AsporComponent from "../AsporComponent";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export type ODataCollectionResultProps<T> = {
    query: ODataQueryable<T>,
    render: (result: T[] | undefined,loading: boolean, reload: ()=>void)=>any
}

export type ODataCollectionResultState<T> = {
    result?: T[],
    loading: boolean
}

export default class ODataCollectionResult<T> extends AsporComponent<ODataCollectionResultProps<T>, ODataCollectionResultState<T>>{

    constructor(props : ODataCollectionResultProps<T>) {
        super(props);
        this.state = {
            loading: true,
            result: undefined,
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ODataCollectionResultProps<T>>, nextState: Readonly<ODataCollectionResultState<T>>, nextContext: any): boolean {
        if(nextProps.query !== this.props.query){
            this.load(nextProps)
            return false;
        }
        return nextState.result !== this.state.result || nextProps.render !== this.props.render;
    }

    componentDidMount() {
        this.load(this.props)
    }

    load(props : ODataCollectionResultProps<T>){
        let query = props.query;
        if(query){
            query.getMany().then((result)=>{
                this.setState({result: result.rows,loading:false})
            })
        }
    }

    reload(){
        this.load(this.props)
    }

    render() {
        return this.props.render(this.state.result,this.state.loading,this.reload);
    }

}
