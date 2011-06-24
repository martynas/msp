function QPSolve(Q, e, A, b, Aeq, beq, lb, ub) {
//	nvars = Q.shape[0] # also e.shape[0]
	var nvars = Q.rows();
//	if lb != None:
	if (lb) {
//        delmask = (lb != -Inf)
//        addA = compress(delmask, eye(nvars), axis=0)
//        addb = compress(delmask, lb, axis=0)
//        A = vstack([A, -addA]) if A != None else -addA
//        b = concatenate([b, -addb]) if b != None else -addb
		var ident = Matrix.I(nvars).x(-1).elements, lbe = lb.elements;
		for (var i = 0; i < lbe.length; i++) 
			if (lbe[i] > -Infinity) {
				A.elements.push(ident[i]);
				b.elements.push(-lbe[i]);
			}
	}
//    if ub != None:
//        delmask = (ub != Inf)
//        addA = compress(delmask, eye(nvars), axis=0)
//        addb = compress(delmask, ub, axis=0)
//        A = vstack([A, addA]) if A != None else addA
//        b = concatenate([b, addb]) if b != None else addb
	
//	n_ineq = A.shape[0]
	n_ineq = A.rows();
//	if Aeq != None:
	if (Aeq) {
//        n_eq = Aeq.shape[0]
		var n_eq = Aeq.rows();
//        B = vstack([
//                hstack([ Q, Aeq.T]),
//                hstack([-Aeq, zeros((n_eq, n_eq))])
//             ])
		var B = Q.augment(Aeq.transpose()),
			B2 = Aeq.x(-1).augment(Matrix.Zero(n_eq, n_eq));
		for (var i = 0; i < B2.elements.length; i++)
			B.elements.push(B2.elements[i]);
//        A0 = hstack([A, zeros((n_ineq, n_eq))])
		var A0 = A.augment(Matrix.Zero(n_ineq, n_eq));
	} else {
//    else:
//        B = Q
//        A0 = A
		var B = Q, A0 = A;
	}
//
//    #print "det(M):", linalg.det(B)
//    #print "B's log10(condition number):", log10(linalg.cond(B))
//    BI = linalg.inv(B)
	BI = B.inv();

//    A0BI = dot(A0, BI)
//    M = dot(A0BI, A0.T)
	A0BI = A0.x(BI);
	M = A0BI.x(A0.transpose());
	
//    q = b + dot(A0BI, concatenate((e, beq))) if Aeq != None else b + dot(A0BI, e)
	var tmp = e;
	if (Aeq) {
		tmp = tmp.concat(beq);
	};
	c = A0BI.x(tmp);
	q = b.add(c);
//
//    # LCP: s = M lambda + q, s >= 0, lambda >= 0, s'lambda = 0
//    # print "M is",M.shape,", q is ",q.shape
//    s, lmbd, retcode = LCPSolve(M,q)
//    s == w; lmdb == z
	res = LCPSolve(M, q);
	if (res) {
//		xmu = dot(BI, -concatenate([e + dot(A.T, lmbd), beq])) if Aeq != None else dot(BI, -(e + dot(A.T, lmbd)))
		
		// (e + dot(A.T, lmbd))
		var tmp = A.transpose();
		tmp = tmp.x($V(res.z));
		tmp = tmp.add(e);
		
		if (Aeq) {
			// concatenate([tmp, beq])
			tmp = tmp.concat(beq);
		}
		
		var xmu = BI.x(-1).x(tmp);
//		x = xmu[:nvars]
		x = xmu.elements.slice(0, nvars);
	} else {
		x = null;
	}
	return x;
}



// You can find algorithms below using data structes defined before

// LCPSolve(M,q): procedure to solve the linear complementarity problem:
// w = M z + q
// w and z >= 0
// w'z = 0
//	The procedure takes the matrix M and vector q as arguments.	The
// procedure has two returns.	The first and second returns are
// the final values of the vectors w and z found by complementary
// pivoting.
// Code is derived from python code from http://openopt.org (HongKongOpt/LCPSolve.py)
function LCPSolve(M, q) {
	
	if (q.e(q.indexOfMin()+1) >= -Sylvester.precision) {
		var z = new Array();
		for (var i = 0; i < q.dimensions(); i++)
			z.push(0);
		return {w: q.elements, z: z};
	} else {
		var dimen = M.rows();
		if (!M.isSquare() || dimen != q.dimensions()) { return null; }
	
		// Create initial tableau
		// tableau = hstack([eye(dimen), -M, -ones((dimen, 1)), asarray(asmatrix(q).T)])
		var tableau = Matrix.I(dimen);
		tableau = tableau.augment(M.multiply(-1));
		tableau = tableau.augment(Matrix.Const(dimen, 1, -1));
		tableau = tableau.augment(Matrix.create(q));
	
	// basis = range(dimen) # basis contains a set of COLUMN indices in the tableau 
		var basis = [];
		for (var i = 0; i < dimen; i++) basis[i] = i;
	// locat = argmin(tableau[:,2*dimen+1]) # row of minimum element in column 2*dimen+1 (last of tableau)
		var locat = tableau.col(2*dimen+2).indexOfMin();
	// basis[locat] = 2*dimen # replace that choice with the row
	// cand = locat + dimen
		basis[locat] = 2*dimen;
		var cand = locat + dimen;
	// pivot = tableau[locat,:]/tableau[locat,2*dimen]
		pivot = tableau.row(locat+1).multiply(1/tableau.e(locat+1, 2*dimen+1));
	// tableau -= tableau[:,2*dimen:2*dimen+1]*pivot # from each column subtract the column 2*dimen, multiplied by pivot 
		var c = tableau.col(2 * dimen+1);
	// tableau[locat,:] = pivot # set all elements of row locat to pivot
		tableau = tableau.map(function(x, i, j) { 
		if (i == locat+1) {
			return pivot.e(j);
			} else {
			return x -	pivot.e(j) * c.e(i); 
		}
		});
	// # Perform complementary pivoting
	// oldDivideErr = seterr(divide='ignore')['divide'] # suppress warnings or exceptions on zerodivide inside numpy
	// while amax(basis) == 2*dimen:
		while (basis.max() == 2*dimen) {
	//		loopcount += 1
	//		eMs = tableau[:,cand]		# Note: eMs is a view, not a copy! Do not assign to it...
			var eMs = tableau.col(cand+1);
	//		missmask = eMs <= 0.
	//		quots = tableau[:,2*dimen+1] / eMs # sometimes eMs elements are zero, but we suppressed warnings...
	//		quots[missmask] = Inf # in any event, we set to +Inf elements of quots corresp. to eMs <= 0. 
	//		locat = argmin(quots)
			
			var locat = 0, missmask = true, quots = [];
			for (var i = 0; i < dimen; i++) {
				missmask = (missmask && eMs.e(i+1) <= Sylvester.precision);
				
				if (eMs.e(i+1) <= Sylvester.precision)
					quots[i] = Infinity;
				else
					quots[i] = tableau.e(i+1, 2*dimen+2)/eMs.e(i+1);
				
				if (quots[locat] > quots[i]) locat = i;
			}
	
	//		if abs(eMs[locat]) > pivtol and not missmask.all(): # and if at least one element is not missing 
			if (Math.abs(eMs.e(locat+1)) > Sylvester.precision && !missmask) {
	//			# reduce tableau
	//			pivot = tableau[locat,:]/tableau[locat,cand]
				pivot = tableau.row(locat+1).multiply(1/tableau.e(locat+1, cand+1));
	//			tableau -= tableau[:,cand:cand+1]*pivot 
	//			tableau[locat,:] = pivot
				var c = tableau.col(cand+1);
				tableau = tableau.map(function(x, i, j) {
				if (i == locat+1) {
					return pivot.e(j);
					} else {
						return x -	pivot.e(j) * c.e(i);
					}
				});
				
	
	//		oldVar = basis[locat]
	//		# New variable enters the basis
	//		basis[locat] = cand
	//		# Select next candidate for entering the basis
	//		if oldVar >= dimen:
	//				cand = oldVar - dimen
	//		else:
	//				cand = oldVar + dimen
				var oldVar = basis[locat];
				basis[locat] = cand
				if (oldVar >= dimen)
					cand = oldVar - dimen
				else
					cand = oldVar + dimen;
	//			else:
	//					rayTerm = True
	//					break
			} else 
				return null;
		}
	//	seterr(divide=oldDivideErr) # restore original handling of zerodivide in Numpy
	//	# Return solution to LCP
	//	vars = zeros(2*dimen+1)
		var vars = [];
		for (var i = 0; i < 2*dimen+1; i++) vars[i] = 0;
	//vars[basis] = tableau[:,2*dimen+1]
		var c = tableau.col(2*dimen+2);
		for (var i = 0; i < dimen; i++) vars[basis[i]] = c.e(i+1);
	//	w = vars[:dimen]
	//	z = vars[dimen:2*dimen]
	//	retcode = vars[2*dimen]
		return {w: vars.slice(0, dimen), z: vars.slice(dimen, 2*dimen)};
	}
};