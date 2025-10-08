import React, {useState} from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../firebase'
import { ref, set } from 'firebase/database'

export default function TicketGenerator(){
  const [count, setCount] = useState(8)
  const [withNames, setWithNames] = useState(false)
  const [namesText, setNamesText] = useState('')
  const db = getDB()

  async function generate(){
    const names = namesText.split('\n').map(s=>s.trim()).filter(Boolean)
    const tickets = []
    for(let i=0;i<count;i++){
      const id = uuidv4()
      const name = withNames ? (names[i] || `Lippu ${i+1}`) : null
      const payload = { id, name }
      // tallenna data (ei QR-kuvaa)
      try{
        await set(ref(db, `tickets/${id}`), { name: name, status: "none", updatedAt: Date.now() })
      }catch(e){
        console.error("Firebase-tallennus epäonnistui:", e)
      }
      const dataStr = JSON.stringify(payload)
      const dataUrl = await QRCode.toDataURL(dataStr)
      tickets.push({ id, name, dataUrl })
    }

    // Luo PDF: 8 lipuketta per sivu (2 saraketta x 4 riviä)
    const pdf = new jsPDF({unit:'mm', format:'a4'})
    const pageWidth = 210, pageHeight = 297
    const margin = 10
    const colW = (pageWidth - margin*2) / 2
    const rowH = (pageHeight - margin*2) / 4
    tickets.forEach((t, idx) => {
      const pageIndex = Math.floor(idx / 8)
      const posInPage = idx % 8
      if(posInPage === 0 && idx !== 0) pdf.addPage()
      const col = posInPage % 2
      const row = Math.floor(posInPage / 2)
      const x = margin + col * colW
      const y = margin + row * rowH
      // Nimi yläkulmaan
      if(t.name) pdf.text(t.name, x + 5, y + 8)
      pdf.addImage(t.dataUrl, 'PNG', x + 5, y + 12, 40, 40)
      pdf.setDrawColor(180)
      pdf.rect(x, y, colW - 5, rowH - 5)
    })

    pdf.save('lipukkeet.pdf')
  }

  return (
    <div>
      <label className="small">Kuinka monta lipuketta?</label>
      <input className="input" type="number" value={count} onChange={e=>setCount(parseInt(e.target.value||"0"))} min={1} />
      <div style={{marginTop:8}}>
        <label><input type="checkbox" checked={withNames} onChange={e=>setWithNames(e.target.checked)} /> Lisää nimet lipukkeisiin</label>
      </div>
      {withNames && (
        <div style={{marginTop:8}}>
          <label className="small">Kirjoita nimet rivittäin (yksi per lipuke)</label>
          <textarea className="input" rows={6} value={namesText} onChange={e=>setNamesText(e.target.value)} />
        </div>
      )}
      <div style={{marginTop:10}}>
        <button className="btn" onClick={generate}>Generoi ja tallenna Firebaseen</button>
      </div>
    </div>
  )
}
