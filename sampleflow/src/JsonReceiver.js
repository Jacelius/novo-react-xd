/* JSON FORMAT 
   
*/
import DepartmentButton from "./DepartmentButton";

 
function fetchSecurityDeps() {
    const data = await fetch("localhost:5000/api/SecurityDeps")
    if (data.status === 200) { // success
        let json = data.json() // [{name:"4355", "teams":{}}, name:"0420", "teams":{}]

        let sec_dep1 = json[0]; // { name:"4355", "teams":{} }

        // Generate a <DepartmentButton departmentId={sec_dep1.name}> 
        let depBtn = <DepartmentButton departmentId={sec_dep1.name}></DepartmentButton>
        // Send the button to departmentview
        return depBtn
    }
}
