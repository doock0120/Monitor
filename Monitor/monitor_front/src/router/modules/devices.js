
import Layout from '@/layout'

const devicesRouter = {
  path: '/devices',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Devices',
  meta: {
    title: '设备',
    icon: 'list'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/devices/list'),
      name: 'DeviceList',
      meta: { title: '设备列表', noCache: true }
    },
    {
      path: 'interface',
      component: () => import('@/views/devices/interface'),
      name: 'DeviceInterface',
      // meta: { title: '设备端口', noCache: true }
    },
    {
      path: 'dotmap',
      component: () => import('@/views/devices/dotmap'),
      name: 'DotMap',
      meta: { 'title': '打点图', noCache: true }
    },
    {
      path: 'flowchart',
      component: () => import('@/views/devices/flowchart'),
      name: 'FlowChart',
      // meta: { title: '流量统计', noCache: true }
    }
  ]
}

export default devicesRouter
