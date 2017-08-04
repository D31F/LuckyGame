window.onload = function()
{
	console.log("ES: 100% del código escrito por David Cabrera Berenguer");
	console.log("EN: 100% of code written by David Cabrera Berenguer");
	var idioma = 
	{
		es : 0,
		en : 1,
	};
	var lang;
	lang = idioma.es;
	var palabras =
	[
		["JUGAR", "TIENDA", "REINICIAR", "MENÚ", "PUNTUACIÓN", "RÉCORD", "DIFICULTAD", "P:"],
		["PLAY" , "SHOP", "RESTART", "MENU", "SCORE", "BEST", "DIFFICULTY", "S:"]
		//["玩" , "購物", "重啟", "菜單", "得分", "最好", "難度", "積分:"]
	];
	var c = document.getElementById("micanvas");
	var ctx = c.getContext("2d");
//<JUEGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO/>
	var anchuras = [];
	for(var i = 0; i < c.width; i++)
	{
		if(c.width % i == 0)
		{
			if(i >= 30 && i < 150)
			{
				anchuras.push(i);
			}
		}
	}
	var j = anchuras.length-1;
	var triW = anchuras[j];
	anchuras.reverse();
	var pinchos = [];
	var monedas = [];
	generarPos(triW, c.width);
	var pincho_img = new Image();
	pincho_img.src = "imgs/spike.png";
	var pj_img = new Image();
	pj_img.src = "imgs/pj.png";
	var pj_img_intoxicado = new Image();
	pj_img_intoxicado.src = "imgs/pj_intoxicado.png";
	var personaje = new sujeto(c , ctx, c.width, c.height, 0, 30, pj_img, pj_img_intoxicado);
	var puntuacion = 0;
	var best;
	if(!localStorage.getItem("bestScore")) best = 0;
	else best = localStorage.getItem("bestScore");
	var dinero;
	if(!localStorage.getItem("coins")) dinero = 0;
	else dinero = localStorage.getItem("coins");
	localStorage.setItem("coins", dinero);
	var lastSpike = posiciones.length;
	function pinchosFrame()
	{
		for (var i = pinchos.length - 1; i >= 0; i--) 
		{
			pinchos[i].dibujar();
			if(pinchos.length < lastSpike)
			{
				pinchos[i].elevar();
			}
			else
			{
				pinchos[i].descender();
				setTimeout(function()
					{
						pinchos.splice(0, pinchos.length);
						posiciones.splice(0, posiciones.length);
						generarPos(triW, c.width);
						pinchos.push(new pincho(c, ctx, c.width, c.height, triW, 35, pincho_img));
					}, 1000);
			}
		}
	}
	function monedasFrame()
	{
		for (var i = monedas.length - 1; i >= 0; i--) 
		{
			monedas[i].aparecer();
			monedas[i].dibujar();
		}
	}
	function pjFrame()
	{
		personaje.gravedad();
		personaje.colision();
		personaje.mover();
		personaje.muerte();
		personaje.dibujar();
	}
	var l = 0;
	function pinchado()
	{
		for (var i = pinchos.length - 1; i >= 0; i--) 
		{
			if(pinchos[i].fuera)
			{
				if(personaje.x > pinchos[i].x - personaje.w && personaje.x < (pinchos[i].x + pinchos[i].w) || personaje.x < (pinchos[i].x + pinchos[i].w) && personaje.x > pinchos[i].x - personaje.w)
				{
					if(personaje.y >= c.height - pinchos[i].h)
					{
						personaje.vivo = false;
						if(!localStorage.getItem("bestScore"))
						{
							localStorage.setItem("bestScore", puntuacion);
						}
						else
						{
							if(puntuacion >= localStorage.getItem("bestScore"))
							{
								localStorage.removeItem("bestScore");
								best = puntuacion;
								localStorage.setItem("bestScore", best);
							}
						}
						setTimeout(function()
						{
							pantalla = 3;
						}, 800);
					}
				}
			}	
		}
	}
	function coin()
	{
		for (var i = monedas.length - 1; i >= 0; i--) 
		{
			if(personaje.x > monedas[i].x - personaje.w && personaje.x < monedas[i].x + monedas[i].w)
			{
				if(personaje.y > monedas[i].y - personaje.w && personaje.y < monedas[i].y + monedas[i].h)
				{
					if(!monedas[i].letal)
					{
						localStorage.removeItem("coins");
						dinero++;
						localStorage.setItem("coins", dinero);
					}
					else
					{
						personaje.intoxicado = true;
						personaje.vivo = false;
						setTimeout(function()
						{
							pantalla = 3;
						}, 2000);
					}
						monedas.splice(i, 1);
				}
			}
		}
	}
	var cont = 
	{
		p : 0,
		m : 0,
	}
	var spikeTime;
	function generarPinchos()
	{
		if(pinchos.length == lastSpike - 1)
		{
			spikeTime = 130;
		}
		else
		{
			spikeTime = 240;
		}
		cont.p++;
		if(cont.p == spikeTime)
		{
			cont.p = 0;
			pinchos.push(new pincho(c, ctx, c.width, c.height, triW, 35, pincho_img));
			puntuacion++;
		}
	}
	var coin_img = new Image();
	coin_img.src = "imgs/coin.png";
	var vodka_img = new Image();
	vodka_img.src = "imgs/vodka.png";
	function generarMonedas()
	{
		if(monedas.length < 5)
		{
			cont.m++;
			if(cont.m == 150)
			{
				cont.m = 0;
				var ran1 = Math.round(Math.random()*25);
				var ran2 = Math.round(Math.random()*25);
				if(ran1 != ran2)
				{
					monedas.push(new moneda(c, ctx, c.width, c.height, coin_img));
				}
				else
				{
					monedas.push(new moneda(c, ctx, c.width, c.height, vodka_img));
					monedas[monedas.length-1].w = 25;
					monedas[monedas.length-1].letal = true;
				}
			}
		}
	}
	function contador()
	{
		ctx.font = "30px Pixel";
		ctx.textAlign = "left";
		ctx.fillStyle = "#000000";
		if(localStorage.getItem("coins"))
		{
			ctx.drawImage(coin_img, 1, 1);
			ctx.fillText(localStorage.getItem("coins"), 22, 25);
		}
		ctx.fillText(palabras[lang][7] + puntuacion, 0, 60);
	}
	function start()
	{
		contador();
		coin();
		pinchado();
		pinchosFrame();
		monedasFrame();
		pjFrame();
		if(personaje.vivo)
		{
			generarPinchos();
			generarMonedas();
		}
	}
//</JUEGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO/>
	var pj = new cubo(c, ctx, c.width, c.height, c.width/2-30/2, 0, pj_img);
	function fondo()
	{
		//ctx.fillStyle = "#00FFFF";
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, c.width, c.height);
	}
	var cajaH =
	{
		izq : 30, 
		der : 30,
	}
	var caja = 
	{
		izq : 
		{
			x : 0,
			y : c.height - 30,
			w : c.width/2,
			h : c.height,
			copia : 
			{
				y : c.height - 30,
			},
		},
		der :
		{
			x : c.width/2,
			y : c.height - 30,
			w : c.width,
			h : c.height,
		},
	}
	var diferencia = caja.izq.y - caja.izq.copia.y;
	var dificultades;
	function dificultadesRestart()
	{
		dificultades = 
		{
			x : [],
			y : [],
			w : 50, 
			h : 30,
			txt : [],
		};
		for(var i = 0; i < 5; i++)
		{
			dificultades.x.push(i * 55 + 13);
			dificultades.y.push(-56);
			dificultades.txt.push(anchuras[i]);
		}
	}
	dificultadesRestart();
	var k = 0;
	function dificultad()
	{
		ctx.fillStyle = "red";
		for(var i = 0; i < anchuras.length; i++)
		{
			ctx.fillStyle = "rgb(" + (51*i) + ", " + (200 - 40*i) + ", 100)";
			ctx.fillRect(dificultades.x[i], dificultades.y[i], dificultades.w, dificultades.h);
			ctx.font = "23px Pixel";
			ctx.textAlign = "center";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(c.width/dificultades.txt[i], dificultades.x[i] + dificultades.w/2, dificultades.y[i] + dificultades.h/2 + 4);
			if(dificultades.y[k] == 84)
			{
				k++;
			}
		}
		dificultades.y[k] += 7;
	}
	var flecha = 
	{
		x : dificultades.x[0] + dificultades.w/2,
		y : 60,
		w : 20,
		h : 30,
		dibujar : function()
		{
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.moveTo(flecha.x, flecha.y);
			ctx.lineTo(flecha.x - flecha.w/2, flecha.y - flecha.h/2);
			ctx.lineTo(flecha.x + flecha.w/2, flecha.y - flecha.h/2);
			ctx.closePath();
			ctx.fill();
		},
		pos : function()
		{
			flecha.y = dificultades.y[0] - 10;
		},
	};
	var seleccion = 
	{
		n : 0,
		seleccionar : function()
		{
			flecha.x = dificultades.x[seleccion.n] + dificultades.w/2;
		},
	};
	function cajas()
	{
		ctx.fillStyle = "black";
		ctx.fillRect(caja.izq.x, caja.izq.y, caja.izq.w, caja.izq.h);
		ctx.fillStyle = "white";
		ctx.fillRect(caja.der.x, caja.der.y, caja.der.w, caja.der.h);
	}
	function movimientoCaja()
	{
		if(pj.pulsando)
		{
			caja.izq.y = pj.y + pj.w + 7;
		}
		diferencia = caja.izq.y - caja.izq.copia.y;
	}
	function textos()
	{
		ctx.textAlign = "center";
		ctx.font = "30px Pixel";
		ctx.fillStyle = "white";
		ctx.fillText(palabras[lang][0], c.width / 4, c.height - 5 + diferencia);
		ctx.fillStyle = "black";
		ctx.fillText(palabras[lang][1], c.width / 4 * 3, c.height - 5);
	}
	function monigote()
	{
		if(pj.play)
		{
			dificultad();
			flecha.pos();
			flecha.dibujar();
			pantalla = 1;
			seleccion.seleccionar();
		}
		pj.mover();
		pj.colision();
		pj.dibujar();
	}
	function menu()
	{
		fondo();
		cajas();
		movimientoCaja();
		textos();
		monigote();
	}
//------------------------------------------------------------------------------------------------------------------------
	var box = 
	{
		w : c.width/1.5,
		h : c.height/2,
		x : c.width + 30, //INICIAL: x : c.width - c.width/1.5 - 10, 
		y : 10,
		acc : 0.3,
		vel : 2,
	};
	var boxes = 
	{
		left: 
		{
			x : box.x,
			y : box.y + box.h + 10,
			w : box.w/2 - 5,
			h : 30,
			select : true,
		},
		right : 
		{
			x : box.x + box.w/2 + 5,
			y : box.y + box.h + 10,
			w : box.w/2 - 5,
			h : 30,
			select : false,
		},
	};
	function reverseBoolean()
	{
		if(boxes.left.select) boxes.left.select = false;
		else boxes.left.select = true;
		if(boxes.right.select) boxes.right.select = false;
		else boxes.right.select = true;
	}
	function menuDeath()
	{
		//CAIXA PRINCIPAL
		if(box.x >= c.width - c.width/1.5 - 10)
		{
			box.vel += box.acc;
			box.x-= box.vel;
			boxes.left.x = box.x;
			boxes.right.x = box.x + box.w/2 + 5;
		}
		ctx.fillStyle = "orange";
		ctx.fillRect(box.x, box.y, box.w, box.h);
		//CAIXES DE BAIX
			//CAIXA 1
		if(boxes.left.select)
		{
			 ctx.fillStyle = "#D77D00";
			 ctx.font = "22px Pixel";
		}
		else
		{
			ctx.fillStyle = "orange";
			ctx.font = "20px Pixel";
		}
		ctx.fillRect(boxes.left.x, boxes.left.y, boxes.left.w, boxes.left.h);
				//TEXT CAIXA 1
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.fillText(palabras[lang][2], boxes.left.x + boxes.left.w/2, boxes.left.y + boxes.left.h/2+5);
			//CAIXA 2
		if(boxes.right.select)
		{
			 ctx.fillStyle = "#D77D00";
			 ctx.font = "22px Pixel";
		}
		else
		{
			ctx.fillStyle = "orange";
			ctx.font = "20px Pixel";
		}
		ctx.fillRect(box.x + box.w/2 + 5, box.y + box.h + 10, box.w/2 - 5, 30);
				//TEXT CAIXA 2
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.fillText(palabras[lang][3], boxes.right.x + boxes.right.w/2, boxes.right.y + boxes.right.h/2+5);
			//TEXT DIFICULTAT
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.font = "20px Pixel";
		ctx.fillText(palabras[lang][6], boxes.left.x + boxes.left.w/2, box.y + 20);
		ctx.font = "70px Pixel";
		ctx.fillText(c.width/anchuras[seleccion.n], boxes.left.x + boxes.left.w/2, box.y + 80);
			//TEXT PUNTUACIÓ
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.font = "20px Pixel";
		ctx.fillText(palabras[lang][4], boxes.right.x + boxes.right.w/2, 30);
		ctx.font = "30px Pixel";
		ctx.fillText(puntuacion, boxes.right.x + boxes.right.w/2, 55);
			//TEXT BEST PUNTUACIÓ
		ctx.font = "20px Pixel";
		ctx.fillText(palabras[lang][5], boxes.right.x + boxes.right.w/2, 75);
		ctx.font = "30px Pixel";
		ctx.fillText(best, boxes.right.x + boxes.right.w/2, 100);

	}
	function lose()
	{
		menuDeath();
		contador();
		pinchosFrame();
	}
//------------------------------------------------------------------------------------------------------------------------
	var separacion = 60;
	var bandera = 
	{
		es : 
		{
			x : 0 + separacion,
			y : c.height/2 - 50/2,
			w : 50,
			h : 50,
		},
		en : 
		{
			x : c.width - 50 - separacion,
			y : c.height/2 - 50/2,
			w : 50,
			h : 50,
		},
	};
	var esFlag_img = new Image();
	esFlag_img.src = "imgs/espana.png";
	var enFlag_img = new Image();
	enFlag_img.src = "imgs/inglaterra.png";
	var esFlag = new banderita(c, ctx, c.width, c.height, bandera.es.x, bandera.es.y, bandera.es.w, bandera.es.h, esFlag_img);
	var enFlag = new banderita(c, ctx, c.width, c.height, bandera.en.x, bandera.en.y, bandera.en.w, bandera.en.h, enFlag_img);
	var flagCount = 0;
	function banderas()
	{
		esFlag.dibujar();
		esFlag.mover();
		esFlag.colision();
		//
		enFlag.dibujar();
		enFlag.mover();
		enFlag.colision();
		if(flagCount == 0)
		{
			focoL.bajar();
			focoR.subir();
		}
		else
		{
			focoL.subir();
			focoR.bajar();
		}
	}
	var focoL = new foco(c, ctx, c.width, c.height, separacion +25-2.5/2);
	var focoR = new foco(c, ctx, c.width, c.height,  c.width - 50 - separacion + 25-2.5/2);
	function focos()
	{
		focoL.colision();
		focoL.dibujar();
		focoL.abrirse();

		focoR.colision();
		focoR.dibujar();
		focoR.abrirse();
	}



	var left = 37;
	var up = 38;
	var right = 39;
	var down = 40;
	var enter = 13;
	window.onkeydown = function(e)
	{
		if(e.keyCode == left || e.which == left)
		{
			if(pantalla < 0)
			{
				if(esFlag.y == c.height/2 - esFlag.h/2 && enFlag.y == c.height/2 - enFlag.h/2)
				{
					if(flagCount != 0)
					{
						flagCount--;
					}
					else
					{
						flagCount++;
					}
					if(flagCount == 0) esFlag.saltar();
					else enFlag.saltar();	
				}
			}
			else if(pantalla == 0)
			{
				pj.velx = -5;	
			}
			else if(pantalla == 1)
			{
				if(seleccion.n != 0)
				{
					seleccion.n--;
				}
				else seleccion.n = 4;
			}
			else if(pantalla == 3)
			{
				reverseBoolean();
			}
			//
		}
		else if(e.keyCode == up || e.which == up)
		{
			if(pantalla == 0) pj.saltar();
			else if(pantalla == 2) personaje.salto();
		}
		else if(e.keyCode == right || e.which == right)
		{
			if(pantalla < 0)
			{
				if(esFlag.y == c.height/2 - esFlag.h/2 && enFlag.y == c.height/2 - enFlag.h/2)
				{
					if(flagCount != 1)
					{
						flagCount++;
					}
					else
					{
						flagCount--;
					}
					if(flagCount == 0) esFlag.saltar();
					else enFlag.saltar();
				}
			}
			else if(pantalla == 0)
			{
				pj.velx = 5;
			}
			else if(pantalla == 1)
			{
				if(seleccion.n < anchuras.length - 1)
				{
					seleccion.n++;
				}
				else seleccion.n = 0;
			}
			else if(pantalla == 3)
			{
				reverseBoolean();
			}
		}
		else if(e.keyCode == down || e.which == down)
		{
			if(pantalla == 2) personaje.descenso();
		}
		else if(e.keyCode == enter || e.which == enter)
		{
			if(pantalla < 0)
			{
				if(flagCount == 0) lang = idioma.es;
				else lang = idioma.en;
				pantalla = 0;
			}
			else if(pantalla == 1)
			{
				triW = anchuras[seleccion.n];
				pinchos.splice(0, pinchos.length);
				posiciones.splice(0, posiciones.length);
				generarPos(triW, c.width);
				lastSpike = posiciones.length;
				pinchos.push(new pincho(c, ctx, c.width, c.height, triW, 35, pincho_img));
				pantalla = 2;
			}
			else if(pantalla == 3)
			{
				if(boxes.left.select)
				{
					returnTo.restart();
				}
				else
				{
					returnTo.menu();
				}
			}
		}
	}
	var returnTo =
	{
		menu : function()
		{
			pj = new cubo(c, ctx, c.width, c.height, c.width/2-30/2, 0, pj_img);
			personaje = new sujeto(c , ctx, c.width, c.height, 0, 30, pj_img, pj_img_intoxicado);
			flecha.x = dificultades.x[0] + dificultades.w/2;
			caja.izq.y = c.height - 30;
			seleccion.n = 0;
			dificultadesRestart();
			k = 0;
			dificultad();
			cont.p = 0;
			puntuacion = 0;
			boxes.left.select = true,
			boxes.right.select = false;
			monedas = [];
			box.x = c.width + 30;
			box.acc = 0.3;
			box.vel = 2;
			pantalla = 0;
		},
		restart : function()
		{
			personaje = new sujeto(c , ctx, c.width, c.height, 0, 30, pj_img, pj_img_intoxicado);
			cont.p = 0;
			puntuacion = 0;
			boxes.left.select = true,
			boxes.right.select = false;
			monedas = [];
			triW = anchuras[seleccion.n];
			pinchos.splice(0, pinchos.length);
			posiciones.splice(0, posiciones.length);
			generarPos(triW, c.width);
			lastSpike = posiciones.length;
			pinchos.push(new pincho(c, ctx, c.width, c.height, triW, 35, pincho_img));
			box.x = c.width + 30;
			box.acc = 0.3;
			box.vel = 2;
			pantalla = 2;
		},
	};
	window.onkeyup = function(e)
	{
		if(e.keyCode == 37 || e.keyCode == 39)
		{
			if(pantalla == 0) pj.velx = 0;
		}
	}
	var pantalla = -1;
	function frame()
	{
		ctx.clearRect(0, 0, c.width, c.height);
		if(pantalla < 0)
		{
			banderas();
			focos();
		}
		else if(pantalla == 0 || pantalla == 1)
		{
			menu();
			personaje.x = pj.lastPos;
			personaje.color = pj.color;
		}
		else if(pantalla == 2)
		{
			start();
		}
		else if(pantalla == 3)
		{
			lose();
		}
		requestAnimationFrame(frame);
	}
	frame();
}