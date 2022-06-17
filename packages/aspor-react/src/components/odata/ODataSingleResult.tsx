import AsporComponent from "../AsporComponent";
import ODataSingleQueryable from "../../libraries/odata/query/ODataSingleQueryable";

export type ODataSingleResultProps<T> = {
    query: ODataSingleQueryable<T>,
    render: (result: T | undefined,loading: boolean, reload: ()=>void)=>any
}

export type ODataSingleResultState<T> = {
    result?: T,
    loading: boolean
}

export default class ODataSingleResult<T> extends AsporComponent<ODataSingleResultProps<T>, ODataSingleResultState<T>>{

    constructor(props : ODataSingleResultProps<T>) {
        super(props);
        this.state = {
            loading: true,
            result: undefined,
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ODataSingleResultProps<T>>, nextState: Readonly<ODataSingleResultState<T>>, nextContext: any): boolean {
        if(nextProps.query !== this.props.query){
            this.load(nextProps)
            return false;
        }
        return nextState.result !== this.state.result || nextProps.render !== this.props.render;
    }

    componentDidMount() {
        this.load(this.props)
    }

    load(props : ODataSingleResultProps<T>){
        let query = props.query;
        if(query){
            query.get().now().then((result)=>{
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
