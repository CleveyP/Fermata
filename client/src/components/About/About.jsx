import "./about.css";
import { useNavigate} from "react-router-dom";

export const About = () =>{

    let navigate = useNavigate();

    return (
       
        <div className="about">
             <button onClick={ () => {navigate("/home");}}>Home</button>
            <h1>About Fermata</h1>
            <hr />
            <h2>Site Description and Intended Useage</h2>
            
            <p id="site-description">The purpose of this application is to allow users to create classical chorals using the principles layed out by Bach<br/>
            The intention is that the created pieces be four part harmonies aka SATB. Obviously, the application does not enforce this behavior,<br/>
            however, the performance is at its best when users conform to having no more than four notes in any one beat. <br/>
            <br/>
            The second service that the app provides is the "AI" mode which is a misnomer... It is not in fact an AI; it can analyze any one beat<br/>
            and show the notes in the beat as well as the possible chords that could be created from the notes that are already in the beat.<br/>
            A correct harmonic analysis of the beat is dependent on what key signature is selected. All key signatures are Major-- <br/>
            If you wish to create a piece in a minor key, you must specify the relative major. EX: if you wish to compose a piece in C minor, <br/>
            then the key signature that you should specify in AI mode is Eb as Eb is the relative major to C minor eg, C minor is enharmonic to Eb major<br/>
            <br/>
            The application also provides various synths and effects that allow for millions of permutations of instruments. In the next update, users will be able to<br/>
            Provide sample MP3 files to create their own instruments. Currently, there are a few built in samples to choose from as well. <br/>
            There is a polyphany limit which will impose upon the composer a limit to the amount of pitches that can be played at the same time, <br/>
            and as different instruments and effects create different numbers of pitches per note, the maximum number of notes per beat will vary<br/>
            depending on the permutation of effects and instruments. Another performance consideration is that the tempo has been limited intentionally.<br/>
            The browser's audio context simply cannot play notes fast enough whilst rerendering the active beat in a synchronized manner... 
             </p>
             <hr />
             <h2>How to Use Fermata</h2>


        </div>
    )
}