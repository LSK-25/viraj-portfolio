import { Readout, SceneNote, SignalWave, StudyArt, WindowFrame, revealText } from './SceneElements';

const labels = ['Desktop companion', 'Listening to a turn', 'Local model handoff', 'Reply with presence', 'Prototype report'];

export function NovaScene({ stage, progress }: { stage: number; progress: number }) {
  return <div className="recon-nova recon-two-columns">
    <div className="recon-presence"><div className="recon-orbit orbit-a"/><div className="recon-orbit orbit-b"/><StudyArt index={0}/><span className="recon-device-label">COMPANION / FORM STUDY</span><div className="recon-presence-status"><i/><span>{stage === 1 ? 'Speech input' : stage === 2 ? 'Local inference' : stage === 3 ? 'Spoken response' : 'Desktop prototype'}</span></div></div>
    <WindowFrame title="NOVA / ADA" label="INTERFACE STUDY">
      <div className="recon-chat"><div className="recon-chat-heading"><span>01 / PRIVATE CONVERSATION</span><h4>{labels[stage]}</h4></div>
      {stage === 0 && <><p className="recon-chat-intro">A familiar voice.<br/><em>A useful connection.</em></p><SignalWave progress={progress}/><div className="recon-chip-row"><span>Local conversation</span><span>Text + speech</span></div></>}
      {stage === 1 && <><div className="recon-speech-ring"><span>MIC</span></div><SignalWave progress={progress}/><div className="recon-chat-bubble user"><small>EXAMPLE SPOKEN TURN</small>{revealText('Explain a Python loop.', progress)}<i className="recon-caret"/></div><div className="recon-input-status">Speech recognition <span>Text transcript</span></div></>}
      {stage === 2 && <><div className="recon-context-card"><small>CONVERSATION CONTEXT</small><p>Explain a Python loop.</p></div><div className="recon-model-path"><span>APP</span><i style={{ backgroundPositionX: `${progress * 100}%` }}/><b>OLLAMA</b><i/><span>REPLY</span></div><div className="recon-token-grid">{['context', 'inference', 'response', 'local host'].map((word, index) => <span key={word} className={progress > index * .14 ? 'is-lit' : ''}>{word}</span>)}</div><SceneNote label="ON THE HOST MACHINE">The desktop application sends context to its local model runtime.</SceneNote></>}
      {stage === 3 && <><div className="recon-chat-bubble user"><small>YOU / EXAMPLE</small>Explain a Python loop.</div><div className="recon-chat-bubble assistant"><small>NOVA / ILLUSTRATIVE REPLY</small>{revealText('A loop repeats an action. For example, print each item in a list.', progress)}</div><SignalWave progress={progress}/><div className="recon-input-status">Response available <span>Text + voice</span></div></>}
      {stage === 4 && <><Readout label="CURRENT IMPLEMENTATION" value="Laptop application" active/><Readout label="INFERENCE" value="Local Ollama runtime"/><Readout label="PHYSICAL COMPANION" value="Future direction"/><SceneNote label="REPORT COMPLETE">The cube is a concept rendering. The working project lives on the desktop.</SceneNote></>}
      </div>
    </WindowFrame>
  </div>;
}
