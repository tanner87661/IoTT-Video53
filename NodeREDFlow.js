[{
	"id": "a10dd57d.8c2e88",
	"type": "mqtt in",
	"z": "defc7615.8197d8",
	"name": "",
	"topic": "dccBC",
	"qos": "1",
	"broker": "5bc7cc44.39f4b4",
	"x": 170,
	"y": 252,
	"wires": [
		["d5e843a9.e4838"]
	]
}, {
	"id": "d5e843a9.e4838",
	"type": "json",
	"z": "defc7615.8197d8",
	"name": "",
	"property": "payload",
	"action": "obj",
	"pretty": false,
	"x": 407,
	"y": 254,
	"wires": [
		["988ea953.3eacc8"]
	]
}, {
	"id": "bb5d07c8.5f2318",
	"type": "mqtt out",
	"z": "defc7615.8197d8",
	"name": "",
	"topic": "LEDSET",
	"qos": "1",
	"retain": "",
	"broker": "5bc7cc44.39f4b4",
	"x": 1160,
	"y": 362,
	"wires": []
}, {
	"id": "988ea953.3eacc8",
	"type": "function",
	"z": "defc7615.8197d8",
	"name": "Remote Panel",
	"func": "//at startup: initialization\nif (msg.topic == \"initnode\") //only called once by timer node\n{\n    //first element is DCC Addr, second is position 1=closed\n    var newArray = [[1,0], [2,0], [3,0], [4,0]]; //initialize all switches to thwrown position\n    flow.set(\"swi\", newArray);\n    flow.set(\"seltrack\", -1); //no track selected\n    return;\n}\n//step 1: record switch settings\nvar swiArray = flow.get(\"swi\");\nif (msg.payload.type == \"switch\")\n{\n    for (var i = 0; i < swiArray.length; i++)\n    {\n        if (swiArray[i][0] == msg.payload.addr)\n        {\n            swiArray[i][1] = msg.payload.dir == \"closed\"? 1:0;\n            flow.set(\"swi\", swiArray);\n            break;\n        }\n    }\n}\nelse\n    return;\n    \n//step 2: evaluate and determine LED settings\nvar currSel = 0;\nfor (var i = 0; i < swiArray.length; i++)\n    if (swiArray[i][1] === 0) //thrown\n        break;\n    else\n        currSel++;\n        \n//step 3: send new LED settings if needed\nvar onMsg = {payload : \"\"};\nvar offMsg = {payload : {\"LEDNr\":[1,2,3,4,5], \"HSV\":[0,0,0]}};\nif (currSel != flow.get(\"seltrack\"))\n{\n    onMsg.payload = {\"LEDNr\": currSel+1, \"HSV\":[85,255,25]}\n    flow.set(\"seltrack\", currSel);   \n    return [offMsg, onMsg];\n}\n",
	"outputs": 2,
	"noerr": 0,
	"x": 710,
	"y": 369,
	"wires": [
		["bb5d07c8.5f2318"],
		["7001f108.a0ffc"]
	]
}, {
	"id": "6c87a29f.3bb3ec",
	"type": "inject",
	"z": "defc7615.8197d8",
	"name": "",
	"topic": "initnode",
	"payload": "",
	"payloadType": "date",
	"repeat": "",
	"crontab": "",
	"once": true,
	"onceDelay": 0.1,
	"x": 211,
	"y": 363,
	"wires": [
		["988ea953.3eacc8"]
	]
}, {
	"id": "7001f108.a0ffc",
	"type": "delay",
	"z": "defc7615.8197d8",
	"name": "",
	"pauseType": "delay",
	"timeout": "200",
	"timeoutUnits": "milliseconds",
	"rate": "1",
	"nbRateUnits": "1",
	"rateUnits": "second",
	"randomFirst": "1",
	"randomLast": "5",
	"randomUnits": "seconds",
	"drop": false,
	"x": 957,
	"y": 418,
	"wires": [
		["bb5d07c8.5f2318"]
	]
}, {
	"id": "5bc7cc44.39f4b4",
	"type": "mqtt-broker",
	"z": "",
	"name": "",
	"broker": "192.168.87.52",
	"port": "1883",
	"clientid": "",
	"usetls": false,
	"compatmode": true,
	"keepalive": "60",
	"cleansession": true,
	"birthTopic": "",
	"birthQos": "0",
	"birthRetain": "false",
	"birthPayload": "",
	"willTopic": "",
	"willQos": "0",
	"willPayload": ""
}]
