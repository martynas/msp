<?xml version="1.0" encoding="ISO-8859-1" ?>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<script type="text/javascript" src="js/prototype.js"></script>
		<script type="text/javascript" src="main-js.jsp"></script>
		<script type="text/javascript" src="external-js.jsp"></script>
		<script type="text/javascript" src="js/tests.js"></script>
		<link rel="stylesheet" type="text/css" media="screen,all" href="css/display.css" />
<title>Friendly Stocks, Test Page</title>
</head>
<body>
	<table>
		<tr>
			<th width=100px>Test</th>
			<th>Input</th>
			<th width=150px>Expected Output</th>
			<th>Actual Output</th>
		</tr>
		
		<tr>
			<td>Simplex 1</td>
			<td>
<pre>
M = [[2., 1.],
    [1., 2.]];
    
q = [-5., -6.];
</pre>
			</td>
			<td>
<pre>
0, 0
</pre>
			</td>
			<td>
<script type="text/javascript">
	var M = $M(
			[[2, 1],
			[1, 2]]),
		q = $V([-5, -6]),
		res;
	res = LCPSolve(M, q);
	printLCPResult(res);
	//res.inspect();
</script>
			</td>
		</tr>
		
		<tr>
			<td>Simplex 2</td>
			<td>
<pre>
M = [[0.42956806, -0.40076658, -0.02880148, -0.42956806, 0.40076658, 0.02880148],
        [-0.40076658, 0.47288367, -0.07211709, 0.40076658, -0.47288367, 0.07211709],
        [-0.02880148, -0.07211709, 0.10091857, 0.02880148, 0.07211709, -0.10091857],
        [-0.42956806, 0.40076658, 0.02880148, 0.42956806, -0.40076658, -0.02880148],
        [ 0.40076658, -0.47288367, 0.07211709, -0.40076658, 0.47288367, -0.07211709],
        [ 0.02880148, 0.07211709, -0.10091857, -0.02880148, -0.07211709, 0.10091857]];
    
q = [1.09389333, -0.53851907, -0.05537426, -0.79389333, 0.83851907, 0.35537426];
</pre>
			</td>
			<td>
<pre>
0, 0
</pre>
			</td>
			<td>
<script type="text/javascript">
	var M = $M(
			[
		        [0.42956806, -0.40076658, -0.02880148, -0.42956806, 0.40076658, 0.02880148],
		        [-0.40076658, 0.47288367, -0.07211709, 0.40076658, -0.47288367, 0.07211709],
		        [-0.02880148, -0.07211709, 0.10091857, 0.02880148, 0.07211709, -0.10091857],
		        [-0.42956806, 0.40076658, 0.02880148, 0.42956806, -0.40076658, -0.02880148],
		        [ 0.40076658, -0.47288367, 0.07211709, -0.40076658, 0.47288367, -0.07211709],
		        [ 0.02880148, 0.07211709, -0.10091857, -0.02880148, -0.07211709, 0.10091857]]),
		q = $V([1.09389333, -0.53851907, -0.05537426, -0.79389333, 0.83851907, 0.35537426]),
		res;
	res = LCPSolve(M, q);
	printLCPResult(res);
	//res.inspect();
</script>
			</td>
		</tr>

				<tr>
			<td>Quadratic Programming 1</td>
			<td>
<pre>
    e = array([2.8, 6.3, 10.8])
    sd = array([1., 7.4, 15.4])
    cc = array([[1.00, 0.40, 0.15],
                [0.40, 1.00, 0.35],
                [0.15, 0.35, 1.00]])
    Q = multiply(cc, outer(sd, sd))
    rt = 14.# risk tolerance: try from ~13.72 to ~42.
    A = array([
               [1., 0., 0.],
               [0., 1., 0.],
               [0., 0., 1.],
               [-1., 0., 0.],
               [0., -1., 0.],
               [0., 0., -1.],
               [1., 1., 1.],
               [-1., -1., -1.]
               ])
    b = array([0.5, 0.5, 0.5, -0.2, -0.2, -0.2, 1.+1e-14, -(1.-1e-14)]) 
    
    x, retcode = QPSolve(-e, 2*Q/rt, A, b)
</pre>
			</td>
			<td>
<pre>
0, 0
</pre>
			</td>
			<td>
<script type="text/javascript">
	var e = $V([-8., -16.]),
		Q = $M([[2., 0.],
				[0., 8.]]),
		A = $M([[1., 1.],
				[1., 0.]]),
		b = $V([5., 3.]);
	//QPSolve(Q, e, A, b);
</script>
			</td>
		</tr>
		
				<tr>
			<td>Quadratic Programming 1</td>
			<td>
<pre>
    e = array([2.8, 6.3, 10.8])
    sd = array([1., 7.4, 15.4])
    cc = array([[1.00, 0.40, 0.15],
                [0.40, 1.00, 0.35],
                [0.15, 0.35, 1.00]])
    Q = multiply(cc, outer(sd, sd))
    rt = 14.# risk tolerance: try from ~13.72 to ~42.
    A = array([
               [1., 0., 0.],
               [0., 1., 0.],
               [0., 0., 1.],
               [-1., 0., 0.],
               [0., -1., 0.],
               [0., 0., -1.],
               [1., 1., 1.],
               [-1., -1., -1.]
               ])
    b = array([0.5, 0.5, 0.5, -0.2, -0.2, -0.2, 1.+1e-14, -(1.-1e-14)]) 
    
    x, retcode = QPSolve(-e, 2*Q/rt, A, b)
</pre>
			</td>
			<td>
<pre>
0, 0
</pre>
			</td>
			<td>
<script type="text/javascript">
	var e = $V([2.8, 6.3, 10.8]),
		sd = $V([1., 7.4, 15.4]),
	    cc = $M([[1.00, 0.40, 0.15],
				[0.40, 1.00, 0.35],
				[0.15, 0.35, 1.00]]),
		A = $M([[1., 0., 0.],
				[0., 1., 0.],
				[0., 0., 1.],
				[-1., 0., 0.],
				[0., -1., 0.],
				[0., 0., -1.],
				[1., 1., 1.],
				[-1., -1., -1.]]),
		b = $V([0.5, 0.5, 0.5, -0.2, -0.2, -0.2, 1.+1e-14, -(1.-1e-14)]),
		rt = 14, // risk tolerance: try from ~13.72 to ~42
		Q, sdd;
	sdd = sd.outerMultiply(sd);
	Q = cc.map(function(x, i, j) {
		return x * sdd.e(i, j);
	});
	QPSolve(Q.x(2/rt), e.x(-1), A, b);
	//res.inspect();
</script>
			</td>
		</tr>
	</table>

</body>
</html>