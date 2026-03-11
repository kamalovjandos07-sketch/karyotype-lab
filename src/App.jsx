/**
 * App — главный компонент симулятора кариотипирования
 * Управляет навигацией по этапам и состоянием выбранного случая
 */
import { useState } from 'react'
import { CaseSelection } from './screens/CaseSelection'
import { Stage1Culture } from './stages/Stage1Culture'
import { Stage2Colchicine } from './stages/Stage2Colchicine'
import { Stage3HypotonicFixation } from './stages/Stage3HypotonicFixation'
import { Stage4Staining } from './stages/Stage4Staining'
import { Stage5Microscopy } from './stages/Stage5Microscopy'
import { Stage6Sorting } from './stages/Stage6Sorting'
import { Stage7Conclusion } from './stages/Stage7Conclusion'

export default function App() {
  const [selectedCase, setSelectedCase] = useState(null)
  const [sex, setSex] = useState(null)
  const [step, setStep] = useState(0)

  const handleCaseSelect = (caseItem, selectedSex) => {
    setSelectedCase(caseItem)
    setSex(selectedSex)
    setStep(1)
  }

  const handleRestart = () => {
    setSelectedCase(null)
    setSex(null)
    setStep(0)
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 7))

  if (step === 0) {
    return <CaseSelection onSelect={handleCaseSelect} />
  }

  const stageProps = { onNext: nextStep }

  switch (step) {
    case 1:
      return <Stage1Culture {...stageProps} />
    case 2:
      return <Stage2Colchicine {...stageProps} />
    case 3:
      return <Stage3HypotonicFixation {...stageProps} />
    case 4:
      return <Stage4Staining {...stageProps} />
    case 5:
      return <Stage5Microscopy {...stageProps} />
    case 6:
      return <Stage6Sorting {...stageProps} caseItem={selectedCase} sex={sex} />
    case 7:
      return (
        <Stage7Conclusion
          caseItem={selectedCase}
          sex={sex}
          onRestart={handleRestart}
        />
      )
    default:
      return null
  }
}
