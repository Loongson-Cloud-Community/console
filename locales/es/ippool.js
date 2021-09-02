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

module.exports = {
  'Pod IP Pool': 'Pod IP Pool',
  'Pod IP Pools': 'Pod IP Pools',

  CREATE_POD_IP_POOL: 'Create Pod IP Pool',

  NETWORK_SEGMENT: 'Network Segment',
  USED_IP_ADDRESSES: 'Used IP Addresses',
  'Used IP': 'Used IP',

  MASK: 'Mask',
  Network: 'Network',

  'First Available': 'First Available',
  'Last Available': 'Last Available',
  AVAILABLE_ADDRESSES: 'Available Number',

  POD_IP_POOL: 'Pod IP Range',

  NUMBER_OF_CREATION_TCAP: 'Number of Creation',
  IP_POOL_CREATE_DESC: 'Pod IP pools to be created',
  'Set to be globally available': 'Set to be globally available',

  IP_ADDRESS_EMPTY_DESC: 'Please enter an IP address.',
  MASK_TIP: 'Please enter a mask.',
  ENTER_NETWORK_SEGMENT_TIP: 'Please enter a network segment.',

  IP_POOL_NUM_TIP: 'Please enter the number of Pod IP pools to be created.',

  POD_IP_POOL_DESC: 'Pod IP pools of the cluster.',
  IP_POOL_CREATE_COUNT_DESC:
    'Up to 10 Pod IP pools can be created at the same time.',
  IPPOOL_USAGE_Q: 'How do I manage a Pod network using a Pod IP pool?',
  IPPOOL_USAGE_A:
    'A Pod IP pool is used to manage the Pod network address space, and the address spaces between different Pod IP Pools cannot overlap. When creating a workload, you can select a specific Pod IP Pool to assign IP addresses from this Pod IP Pool to the created Pods.',

  IPPOOL_ASSIGN_WORKSPACE_DESC: 'Assign the Pod IP pool to a workspace.',
  IPPOOL_ASSIGN_WORKSPACE_ALLOCATED_WARNING:
    'The Pod IP pool is in use and cannot be assigned to another specific workspace.',
  IPPOOL_ASSIGN_WORKSPACE_CHANGE_WARNING:
    'The Pod IP pool is in use with a specific workspace assigned. The workspace cannot be changed.',

  IPPOOL_WORKSPACE_EMPTY_TIP: 'No workspace is using this Pod IP pool.',
  // IP Pod Pools List Page
  TOTAL_VALUE: 'Total: {value}',
  ALL: 'Todos',
  NOT_ASSIGNED: 'No asignado',
  WORKSPACE: 'Espacio de trabajo',
}
