import { useNavigate } from "react-router-dom";
import * as Icons from '../icons';

function PrevPageBtn() {
    let history = useNavigate();

    return (
            <button className="PrevBtn" onClick={() => {
                history.goBack();
            }}>
                <Icons.Prevpage />
            </button>
    );
}
  
export default PrevPageBtn;