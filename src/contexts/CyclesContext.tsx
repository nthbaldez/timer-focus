import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { cyclesReducer } from '../reducers/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/actions'
import { differenceInSeconds } from 'date-fns'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CreateNewCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleID: string | null
  amountSecondsPassed: number
  setCurrentCycleAsFinished: () => void
  handleSetAmountSecondsPassed: (amount: number) => void
  createNewCycle: (data: CreateNewCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleID: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) return JSON.parse(storedStateAsJSON)

      return initialState
    },
  )

  const { cycles, activeCycleID } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function handleSetAmountSecondsPassed(amount: number) {
    setAmountSecondsPassed(amount)
  }

  function createNewCycle(data: CreateNewCycleData) {
    const { task, minutesAmount } = data
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
    // reset()
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  function setCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleID,
        setCurrentCycleAsFinished,
        amountSecondsPassed,
        handleSetAmountSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
