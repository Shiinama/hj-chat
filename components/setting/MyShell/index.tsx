import { FC } from 'react'

import MyRobotList from '../MyRobotList'

export interface MyShellProps {}
/** 看似这个组件就没什么用了，和allRobot风格保持一致吧 */
const MyShell: FC<MyShellProps> = () => {
  return <MyRobotList />
}
export default MyShell
