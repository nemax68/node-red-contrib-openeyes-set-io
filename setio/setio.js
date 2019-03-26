/**
 * Copyright 2018 OPEN-EYES S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/

module.exports = function(RED) {
  "use strict";

	// The main node definition - most things happen in here
	function SetIOSensor(n) {
		// Create a RED node
		RED.nodes.createNode(this,n);
    this.ioid = Number(n.ioid);
    this.value = Number(n.value);
		// Store local copies of the node configuration (as defined in the .html)
		var msg = { topic: "set-io" };
		this.path = "/dev/sd102io";
		this.evtype = 1; // EV_KEY
		var node = this;

		var FS = require("fs");

    node.status({fill: "green", shape: "dot", text: 'link'});

    node.on('input', function(msg) {
      var str;
    	var payload=msg.payload;
    	var n;

      if(node.ioid==1)
    	  str = "out1 ";
      else if(node.ioid==2)
    	  str = "out2 ";
      else if(node.ioid==3)
        str = "eserr ";
      else
        str = payload.port;

      if(node.value==0)
        str = str + "off";
      else if(node.value==1)
        str = str + "on";
      else
        str = str + " " + payload.value;

      FS.access(node.path, FS.F_OK, (err) => {
        if (err) {
          console.error(err)
          return
        }
        FS.writeFile(node.path, str, function(err, str) {
          if (err) console.log(err);
        });
      })


		});

    this.on('close', function(readstream) {
      readstream.destroy();
		});

	}

	// Register the node by name. This must be called before overriding any of the
	// Node functions.
	RED.nodes.registerType("set-io",SetIOSensor);
}
