/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import { isEmpty } from 'lodash'
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import classNames from 'classnames'

import { Button, Dropdown, Menu, Icon } from '@kube-design/components'
import { Panel } from 'components/Base'
import GatewaySettingModal from 'projects/components/Modals/GatewaySetting'
import DeleteModal from 'components/Modals/Delete'
import GatewayStore from 'stores/gateway'

import styles from './index.scss'

@inject('rootStore')
@observer
class InternetAccess extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showGatewaySetting: false,
      showDelete: false,
    }

    this.store = new GatewayStore()
  }

  componentDidMount() {
    this.store.getGateway(this.props.match.params)
  }

  get canEdit() {
    return this.props.actions.includes('manage')
  }

  get itemActions() {
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('SET_GATEWAY'),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('REMOVE'),
      },
    ]
  }

  showGatewaySetting = () => {
    this.setState({ showGatewaySetting: true })
  }

  hideGatewaySetting = () => {
    this.setState({ showGatewaySetting: false })
  }

  handleGatewaySetting = data => {
    this.hideGatewaySetting()
    const { cluster, namespace } = this.props.match.params
    const gateway = toJS(this.store.gateway.data)

    const func = isEmpty(gateway)
      ? this.store.addGateway.bind(this.store)
      : this.store.editGateway.bind(this.store)

    func({ cluster, namespace }, data).then(() => {
      this.store.getGateway({ cluster, namespace })
    })
  }

  hideDelete = () => {
    this.setState({ showDelete: false })
  }

  handleDelete = () => {
    const { cluster, namespace } = this.props.match.params
    this.store.deleteGateway({ cluster, namespace }).then(() => {
      this.hideDelete()
      this.store.getGateway({ cluster, namespace })
    })
  }

  handleMoreMenuClick = (e, key) => {
    switch (key) {
      case 'edit':
        this.setState({ showGatewaySetting: true })
        break
      case 'delete':
        this.setState({ showDelete: true })
        break
      default:
        break
    }
  }

  getNodePorts(gateway) {
    if (!gateway.ports) {
      return '-'
    }

    return gateway.ports.map(port => `${port.name}:${port.nodePort}`).join('; ')
  }

  getExternalIP(gateway) {
    let ip = '-'

    if (!isEmpty(gateway.loadBalancerIngress)) {
      ip = gateway.loadBalancerIngress.join('; ')
    } else if (!isEmpty(gateway.externalIPs)) {
      ip = gateway.externalIPs.join('; ')
    }

    return ip || '-'
  }

  renderEmpty() {
    return (
      <Panel className="margin-t12 margin-b12" title={t('EXTERNAL_ACCESS')}>
        <div className={styles.empty}>
          <div className={styles.icon}>
            <Icon name="loadbalancer" size={40} />
          </div>
          <div className={styles.text}>
            <div>{t('GATEWAY_NOT_SET')}</div>
            <p>{t('SET_GATEWAY_TIP')}</p>
          </div>
          {this.canEdit && (
            <Button
              className="margin-t12"
              type="control"
              onClick={this.showGatewaySetting}
            >
              {t('SET_GATEWAY')}
            </Button>
          )}
        </div>
      </Panel>
    )
  }

  renderMoreMenu() {
    return (
      <Menu onClick={this.handleMoreMenuClick}>
        {this.itemActions.map(action => (
          <Menu.MenuItem key={action.key}>
            <Icon name={action.icon} /> {action.text}
          </Menu.MenuItem>
        ))}
      </Menu>
    )
  }

  renderOperations() {
    return (
      <Dropdown
        content={this.renderMoreMenu()}
        trigger="click"
        placement="bottomRight"
      >
        <Button icon="more" type="flat" />
      </Dropdown>
    )
  }

  renderInternetAccess(gateway) {
    const { cluster } = this.props.match.params
    return (
      <Panel className="margin-t12" title={t('EXTERNAL_ACCESS')}>
        <div className={styles.header}>
          <Icon name="eip-group" size={40} />
          <div className={styles.item}>
            <div>{gateway.type}</div>
            <p>{t('ACCESS_METHOD')}</p>
          </div>
          {gateway.type === 'NodePort' ? (
            <>
              <div className={styles.item}>
                <div>{gateway.loadBalancerIngress.join('; ') || '-'}</div>
                <p>{t('GATEWAY_ADDRESS_TCAP')}</p>
              </div>
              <div className={styles.item}>
                <div>{this.getNodePorts(gateway)}</div>
                <p>{t('NodePort')}</p>
              </div>
            </>
          ) : (
            <div className={styles.item}>
              <div>{this.getExternalIP(gateway)}</div>
              <p>{t('EXTERNAL_IP_ADDRESS')}</p>
            </div>
          )}
          {globals.app.hasClusterModule(cluster, 'servicemesh') && (
            <div className={styles.item}>
              <div>
                {gateway.serviceMeshEnable ? t('ENABLED') : t('DISABLED')}
              </div>
              <p>{t('APPLICATION_GOVERNANCE')}</p>
            </div>
          )}
          {this.canEdit && (
            <div className={classNames(styles.item, 'text-right')}>
              <Dropdown
                theme="dark"
                content={this.renderMoreMenu()}
                trigger="click"
                placement="bottomRight"
              >
                <Button>{t('EDIT')}</Button>
              </Dropdown>
            </div>
          )}
        </div>
        {gateway.type === 'LoadBalancer' && (
          <div className={styles.annotations}>
            <p>{t('ANNOTATION_PL')}</p>
            <ul>
              {Object.entries(gateway.annotations).map(([key, value]) => (
                <li key={key}>
                  <span className={styles.key}>{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>
    )
  }

  renderContent() {
    const { data, isLoading } = toJS(this.store.gateway)

    if (isLoading) {
      return null
    }

    if (isEmpty(data)) {
      return this.renderEmpty()
    }

    return this.renderInternetAccess(data)
  }

  renderModals() {
    const { cluster } = this.props.match.params
    return (
      <div>
        <GatewaySettingModal
          cluster={cluster}
          detail={toJS(this.store.gateway.data)}
          visible={this.state.showGatewaySetting}
          onOk={this.handleGatewaySetting}
          onCancel={this.hideGatewaySetting}
          isSubmitting={this.store.isSubmitting}
        />
        <DeleteModal
          title={t('DELETE_INTERNET_ACCESS_TITLE')}
          desc={t('DELETE_INTERNET_ACCESS_DESC')}
          visible={this.state.showDelete}
          onOk={this.handleDelete}
          onCancel={this.hideDelete}
          isSubmitting={this.store.isSubmitting}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderContent()}
        {this.canEdit && this.renderModals()}
      </div>
    )
  }
}

export default InternetAccess