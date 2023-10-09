import { Timer, Scroll } from 'phosphor-react'
import { HeaderContainer } from './styles'

import { NavLink } from 'react-router-dom'
export default function Header() {
  return (
    <HeaderContainer>
      <span>TIMER FOCUS</span>
      <nav>
        <NavLink to="/" title="Timer da aplicação">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
