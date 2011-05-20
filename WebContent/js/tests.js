/**
 * 
 */

function printLCPResult(result) {
	if (res == null) {
		document.write("null");
	} else {
		document.write("ok<br/>");
		document.write("w: ")
		for (var i = 0; i < res.w.length; i++){
			if (i > 0) document.write(", ");
			document.write(res.w[i]);
		}
		document.write("<br/>");
		
		document.write("z: ")
		for (var i = 0; i < res.z.length; i++){
			if (i > 0) document.write(", ");
			document.write(res.z[i]);
		}
		document.write("<br/>");
	}
}
