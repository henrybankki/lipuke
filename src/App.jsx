import React, {useState} from 'react'
import TicketGenerator from './ticket/TicketGenerator'
import Scanner from './scanner/Scanner'
import { initFirebase } from './firebase'

initFirebase()

export default function App(){
  const [mode, setMode] = useState('generate')
  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2>Lipuke-järjestelmä</h2>
          <div className="small">Nerokasta, mutta käytännöllistä.</div>
        </div>

        <div style={{display:'flex',gap:10,marginBottom:12}}>
          <button className="btn" onClick={()=>setMode('generate')}>Generoi liput</button>
          <button className="btn" onClick={()=>setMode('scan')}>Skannaa liput</button>
        </div>

        {mode === 'generate' ? <TicketGenerator /> : <Scanner />}
      </div>

      <div className="card">
        <h3>Ohjeet</h3>
        <p className="small">Projekti sisältää lipukkeiden generaattorin, PDF-tallennuksen ja reaaliaikaisen skannauksen.</p>
        <ol>
          <li>Lisää Firebase-konfiguraatio tiedostoon <code>src/firebase.js</code>.</li>
          <li>Asenna riippuvuudet: <code>npm install</code>.</li>
          <li>Aja: <code>npm run dev</code> ja avaa selaimessa.</li>
        </ol>

        <h4>Toiminnallisuudet</h4>
        <ul>
          <li>Generoi liput ja tallenna data Firebaseen (vain ID, nimi, tila).</li>
          <li>Skannaa QR-koodit kameralla. Tuntematon lipuke piippaa.</li>
          <li>Kysyy vahvistusta jos sama suunta (sisään/ulos) skannataan peräkkäin.</li>
        </ul>
      </div>
    </div>
  )
}
