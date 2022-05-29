import { useNavigate } from "react-router-dom";
import * as Icons from '../icons';

function NextPageBtn() {
    let history = useNavigate();

    return (
            <button className="NextBtn" onClick={() => {
                history.goForward();
            }}>
                <Icons.Nextpage />
            </button>
    );
}
  
export default NextPageBtn;