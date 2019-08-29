import {save} from './EventResponses';
const windowEvents= (cyRef) => {
    window.addEventListener("keyup", event => {
        if (event.keyCode == 76) {
         // setRepeatTracker(false);
        }
      });
      window.addEventListener("beforeunload", function (e) {
        //confMessage(cyRef,e);
      });
      window.addEventListener("unload", function(evt){
        //saveWhichUser();
        cyRef.nodes().classes('');
        cyRef.elements().deselect();
        save(cyRef, false);
      });
      document.addEventListener('click', function(e) { 
        if(document.activeElement.toString() == '[object HTMLButtonElement]'){ 
            document.activeElement.blur(); 
        }
      });
}
export default windowEvents;