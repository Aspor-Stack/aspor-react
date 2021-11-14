import AsporComponent from "../AsporComponent";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export type ODataFirstCollectionResultProps<T> = {
    query: ODataQueryable<T>,
    render: (result: T | undefined,loading: boolean, reload: ()=>void)=>any
}

export type ODataFirstCollectionResultState<T> = {
    result?: T,
    loading: boolean
}

export default class ODataFirstCollectionResult<T> extends AsporComponent<ODataFirstCollectionResultProps<T>, ODataFirstCollectionResultState<T>>{

    constructor(props : ODataFirstCollectionResultProps<T>) {
        super(props);
        this.state = {
            loading: true,
            result: undefined,
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ODataFirstCollectionResultProps<T>>, nextState: Readonly<ODataFirstCollectionResultState<T>>, nextContext: any): boolean {
        if(nextProps.query !== this.props.query){
            this.load(nextProps)
            return false;
        }
        return nextState.result !== this.state.result || nextProps.render !== this.props.render;
    }

    componentDidMount() {
        this.load(this.props)
    }

    load(props : ODataFirstCollectionResultProps<T>){
        let query = props.query;
        if(query){
            query.getFirst().then((result)=>{
                this.setState({result,loading:false})
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
