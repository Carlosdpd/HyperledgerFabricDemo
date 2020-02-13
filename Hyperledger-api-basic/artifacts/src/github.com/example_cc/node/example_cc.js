/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

  // Initialize the chaincode
  async Init(stub) {
    console.info('=========== Instantiated chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.error('no method of name:' + ret.fcn + ' found');
      return shim.error('no method of name:' + ret.fcn + ' found');
    }

    console.info('\nCalling method : ' + ret.fcn);
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async insertValue(stub, args) {

    console.info('============= START : Insert new value on ledger ===========');

    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let department = args[0];
    let value = args[1];

    if (!department || !value) {
      throw new Error('asset holding must not be empty');
    }

    let departmentAsBytes = await stub.getState(department);

    if (departmentAsBytes.length > 0){
      throw new Error('The value: ' + departmentAsBytes +' already exists');
    }

    let amount = args[1];

    //Skip number validation
    /*
    let amount = parseInt(args[1]);
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Expecting integer value for amount to be transaferred');
    }*/

    console.info(util.format('value = %d', amount));

    await stub.putState(args[0], Buffer.from(amount.toString()));

    await stub.setEvent('New value', Buffer.from(amount.toString()));

    console.info('============= END : Insert new value on ledger ===========');

  }

  async editProject(stub, args) {

    console.info('============= START : Modify value on ledger ===========');

    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }

    let project = args[0];
    let key = args[1];
    let value = args[2];

    if (!project || !value) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let projectBytes = await stub.getState(project);
    if (!projectBytes || projectBytes.length == 0) {
      throw new Error('Failed to get state of asset holder department or does not exists');
    }

    let projectObj = JSON.parse(projectBytes.toString());
    if (Array.isArray(projectObj[key])) {
      projectObj[key].push(value);
    }else{
      projectObj[key] = value;
    }

    console.log(projectObj);

    let newProject = JSON.stringify(projectObj);

    await stub.putState(args[0], Buffer.from(newProject));

    await stub.setEvent('Edited project', Buffer.from(newProject));

    console.info('============= END : Modify value on ledger ===========');

  }

  async getValue(stub, args){
    console.info('============= START : get value on ledger ===========');

    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting value to query');
    }
    let valueToQuery = args[0];

    let valueAsBytes = await stub.getState(valueToQuery);
    if (!valueAsBytes || valueAsBytes.toString().length <= 0) {
      throw new Error(valueToQuery + ' does not exist: ');
    }
    return valueAsBytes;

    console.info('============= END : get value on ledger ===========');

  }

  async getTaskByIndex(stub, args){
    console.info('============= START : get task by index on ledger ===========');

    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting value to query');
    }
    let valueToQuery = args[0];
    let index = args[1];

    let valueAsBytes = await stub.getState(valueToQuery);

    let projectObj = JSON.parse(valueAsBytes.toString());
    let task = JSON.stringify(projectObj.tasks[index]);

    if (!valueAsBytes || valueAsBytes.toString().length <= 0) {
      throw new Error(valueToQuery + ' does not exist: ');
    }

    return Buffer.from(task);

    console.info('============= END :  get task by index on ledger ===========');
  }

  async editTaskByIndex(stub, args) {

    console.info('============= START : Modify task by index on ledger ===========');

    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }

    let project = args[0];
    let index = args[1];
    let value = args[2];

    if (!project || !value) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let projectBytes = await stub.getState(project);
    if (!projectBytes || projectBytes.length == 0) {
      throw new Error('Failed to get state of asset holder department or does not exists');
    }

    let projectObj = JSON.parse(projectBytes.toString());
    let taskValue = JSON.parse(value.toString());
    /* Might be useful later? (1)
    if (taskValue.taskState !== 'Pending') {
      projectObj.pendingTasks = projectObj.pendingTasks - 1;
    }*/
    projectObj.tasks[index] = value;
    console.log(projectObj);

    let newProject = JSON.stringify(projectObj);

    await stub.putState(args[0], Buffer.from(newProject));

    await stub.setEvent('Edited task number' + index, Buffer.from(newProject));

    console.info('============= END : Modify task by index on ledger ===========');

  }

  async deleteElemByIndex(stub, args) {

    console.info('============= START : delete by index on ledger ===========');

    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let project = args[0];
    let key = args[1];
    let index = args[2];


    if (!project || !index) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let projectBytes = await stub.getState(project);
    if (!projectBytes || projectBytes.length == 0) {
      throw new Error('Failed to get state of asset holder department or does not exists');
    }

    let projectObj = JSON.parse(projectBytes.toString());
    projectObj[key].splice(index, 1);
    console.log(projectObj);

    let newProject = JSON.stringify(projectObj);

    await stub.putState(args[0], Buffer.from(newProject));

    await stub.setEvent('deleted task number ' + index, Buffer.from(newProject));

    console.info('============= END : delete by index on ledger ===========');

  }

  async deleteElemByName(stub, args) {

    console.info('============= START : delete by name on ledger ===========');

    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let project = args[0];
    let key = args[1];
    let name = args[2];


    if (!project || !name) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let projectBytes = await stub.getState(project);
    if (!projectBytes || projectBytes.length == 0) {
      throw new Error('Failed to get state of asset holder department or does not exists');
    }

    //This method must be reviewed. Too inneficient.
    let projectObj = JSON.parse(projectBytes.toString());
    for (var i = 0; i < projectObj[key].length; i++) {
      if (JSON.stringify(name) === projectObj[key][i]) {
        projectObj[key].splice(i, 1);
      }
    }

    let newProject = JSON.stringify(projectObj);

    await stub.putState(args[0], Buffer.from(newProject));

    await stub.setEvent('deleted element: ' + name, Buffer.from(newProject));

    console.info('============= END : delete by name on ledger ===========');

  }

  // Deletes an entity from state
  async deleteValue(stub, args) {
    console.info('============= START : Delete value on ledger ===========');


    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let valueToDelete = args[0];

    // Delete the key from the state in ledger
    await stub.deleteState(valueToDelete);

    await stub.setEvent('Deleted value', '');

    console.info('============= END : Delete value on ledger ===========');

  }

  // gets history of an entity from state
  async getKeyHistory(stub, args) {
    console.info('============= START : Get history value on ledger ===========');

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }

    let valueHistory = args[0];
    console.info('- start getHistoryForValue: %s\n', valueHistory);

    let iterator = await stub.getHistoryForKey(valueHistory);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
    console.info('============= END : Get history value on ledger ===========');

  }

  // get all keys
  async getAllHistory(stub, args) {
    console.info('============= START : Get all keys on ledger ===========');

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }

    let valueHistory = args[0];
    console.info('- start getHistoryForValue: %s\n', valueHistory);

    let iterator = await stub.getStateByRange('', '');

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
    console.info('============= END : Get all keys on ledger ===========');

  }

};

shim.start(new Chaincode());
