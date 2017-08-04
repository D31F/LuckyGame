var posiciones = [];
function generarPos(trianguloW, canvasW)
{
	for(i = 0; i < canvasW / trianguloW; i++)
	{
		posiciones.push(i * trianguloW);
	}
}
function pincho(c, ctx, sw, sh, w, h, img)
{
	this.c = c;
	this.ctx = ctx;
	this.sw = sw;
	this.sh = sh;
	this.w = w;
	this.h = h;
	this.random = Math.round(Math.random()*(posiciones.length-1));
	this.x = posiciones[this.random];
	posiciones.splice(this.random, 1);
	this.y = this.sh + this.h;
	this.vel = 0.85;
	this.acc = 0;
	this.fuera = false;
	this.rojo = -100;
	this.verde = 255;
	this.img = img;
	this.dibujar = function()
	{
		/*this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(this.x+this.w/2, this.y - this.h);
		this.ctx.lineTo(this.x+this.w, this.y);
		this.ctx.closePath();
		this.ctx.fillStyle = "rgb(" + this.rojo + ", " + this.verde + ", 0)";
		this.ctx.fill();
		this.ctx.fillStyle = "#000000";
		this.ctx.strokeStyle = "#000000";
		this.ctx.stroke();
		this.colorear();*/
		this.ctx.drawImage(this.img, this.x, this.y, this.w, -this.h);
	}
	this.colorear = function()
	{
		this.rojo+= 4;
		this.verde-= 4;
		if(this.rojo > 255) this.rojo = 255;
		if(this.verde < 0) this.verde = 0;
	}
	this.elevar = function()
	{
		this.vel += this.acc;
		this.y -= this.vel;
		if(this.y < this.sh)
		{
			this.y = this.sh;
			this.fuera = true;
		}
	}
	this.descender = function()
	{
		this.vel += this.acc;
		this.y += this.vel;
		this.fuera = false;
	}
}
function moneda(c, ctx, sw, sh, img)
{
	this.c = c;
	this.ctx = ctx;
	this.sw = sw;
	this.sh = sh;
	this.w = 20;
	this.h = 30;
	this.x = Math.round(Math.random()*(this.sw - this.w));
	this.y = 30 + Math.round(Math.random()*(this.sh-125));
	if(this.y < 65) this.x += 70;
	this.img = img;
	this.transparencia = 0;
	this.letal = false;
	this.dibujar = function()
	{
		this.ctx.globalAlpha = this.transparencia;
		this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
		this.ctx.globalAlpha = 1;
	}
	this.aparecer = function()
	{
		if(this.transparencia <= 1)
		{
			this.transparencia +=0.0375;
		}
	}
}
function sujeto(c, ctx, sw, sh, x, w, img, img_intoxicado)
{
	this.c = c;
	this.ctx = ctx;
	this.sw = sw;
	this.sh = sh;
	this.w = w;
	this.x = x;
	this.y = this.sh - this.w;
	this.velx = 3;
	this.vely = 0;
	this.velSalto = 4;
	this.contadorSalto = 2;
	this.grav = 0.1;
	this.enSuelo = true;
	this.stop = false;
	this.vivo = true;
	this.color = "black"; //ERROR
	this.img = img;
	this.img_intoxicado = img_intoxicado;
	this.intoxicado = false;
	this.dibujar = function()
	{
		this.ctx.fillStyle = this.color;
		if(!this.intoxicado)
		{
			this.ctx.drawImage(this.img, this.x, this.y, this.w, this.w);
		}
		else
		{
			this.ctx.drawImage(this.img_intoxicado, this.x, this.y, this.w, this.w);
		}
	}
	this.mover = function()
	{
		this.x+= this.velx;
	}
	this.salto = function()
	{
		if(this.contadorSalto != 0 && this.vivo)
		{
			this.vely = -this.velSalto;
			this.enSuelo = false;
			this.contadorSalto--;
		}
	}
	this.descenso = function()
	{
		this.vely = 7;
	}
	this.gravedad = function()
	{
		this.vely += this.grav;
		this.y += this.vely;
	}
	this.colision = function()
	{
		if(this.vivo)
		{
			if(this.x <= 0)
			{
				this.x = 0;
				this.velx *= -1;
			}
			else if(this.x >= this.sw - this.w)
			{
				this.x = this.sw - this.w;
				this.velx *= -1;
			}
			if(this.y >= this.sh - this.w)
			{
				this.enSuelo = true;
				this.contadorSalto = 2;
				this.vely = 0;
				this.y = this.sh - this.w;
			}
		}
	}
	this.muerte = function()
	{
		if(!this.vivo && this.w != 0 && !this.intoxicado)
		{
			this.w--;
			this.vely = -5;
		}
		else if(!this.vivo && this.w != 0 && this.intoxicado)
		{
			this.velx = 0;
			this.vely = -2;
		}
	}
}
var rgb = [Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)];
function cubo(c, ctx, sw, sh, x, y, img)
{
	this.c = c;
	this.ctx = ctx;
	this.sw = sw;
	this.sh = sh;
	this.x = x;
	this.y = y-100;
	this.w = 30;
	this.velx = 0;
	this.vely = 0;
	this.grav = 0.1;
	this.salto = 0;
	this.play = false;
	this.lastPos;
	this.sdr = 30; // sdr --> Superficie de recolzamiento
	this.pulsando = false;
	this.img = img;
	this.dibujar = function()
	{
		this.ctx.drawImage(this.img, this.x, this.y, this.w, this.w);
	}
	this.mover = function()
	{
		this.x += this.velx;
		this.vely += this.grav;
		this.y += this.vely;
	}
	this.colision = function()
	{
		if(this.x <= 0)
		{
			this.x = 0;
		}
		else if(this.x >= this.sw - this.w)
		{
			this.x = this.sw - this.w;
		}
		if(this.salto == 0 && !this.pulsando)
		{
			if(this.y >= this.sh - this.w - this.sdr)
			{
				this.vely = 0;
				this.y = this.sh - this.w - this.sdr;
				if(this.salto > 0)
				{
					if(this.x <= this.sw/2 - this.w/2)
					{
						this.salto--;
						this.lastPos = this.x;
					}
					else 
					{
						this.salto--;
					}
				}
			}
		}
		else
		{
			if(this.y > this.sh - this.w - this.sdr)
			{
				if(this.x <= this.sw/2 - this.w/2)
				{
					this.pulsando = true;
					if(this.y >= this.sh - this.w + 1)
					{
						this.y = this.sh - this.w;
						if(this.x <= this.sw/2 - this.w/2)
						{
							this.salto--;
							this.lastPos = this.x;
							this.play = true;
						}
						else 
						{
							this.salto--;
						}
					}
				}
				else
				{
					this.y = this.sh - this.w - this.sdr;
					this.salto--;
				}
			}
		}
	}
	this.saltar = function()
	{
		if(this.salto == 0)
		{
			this.vely = -3;
			this.sdr = 30;
			this.salto++;
		}
	}
}
function banderita(c, ctx, sw, sh, x, y, w, h, img)
{
	this.c = c;
	this.ctx = ctx;
	this.sw = sw;
	this.sh = sh;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.img = img;
	this.vely = 0;
	this.grav = 0.2;
	this.dibujar = function()
	{
		this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	};
	this.mover = function()
	{
		this.vely += this.grav;
		this.y += this.vely;
	};
	this.colision = function()
	{
		if(this.y >= this.sh/2 - this.h/2)
		{
			this.y = this.sh/2 - this.h/2;
		}
	};
	this.saltar = function()
	{
		this.vely = 0;
		this.vely -= 3;
	};
}
function foco(c, ctx, sw, sh, x)
{
	this.c = c;
	this.ctx = ctx;
	this.sw = sw;
	this.sh = sh;
	this.x = x;
	this.y = -((this.sh/2 + 25)*2)+70;
	this.w = 2.5;
	this.h = this.sh/2 + 25;
	this.vely = 6;
	this.apertura = 0;
	this.bajado = false;
	this.brillo = 1;
	this.dibujar = function()
	{
		//this.ctx.fillRect(this.x, this.y, this.w, this.h);
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y)
		this.ctx.lineTo(this.x + this.w, this.y);
		this.ctx.lineTo(this.x + this.w + this.apertura, this.y + this.h);
		this.ctx.lineTo(this.x - this.apertura, this.y + this.h);
		this.ctx.lineTo(this.x, this.y);
		this.ctx.closePath();
		this.ctx.fillStyle = "rgba(219, 255, 0," + this.brillo + ")";
		this.ctx.fill();
	}
	this.subir = function()
	{
		this.y -= this.vely;
		this.bajado = false;
		if(this.brillo < 1)
		{
			this.brillo += 0.005;
		}
	}
	this.bajar = function()
	{
		this.y += this.vely;
		if(this.brillo > 0.5)
		{
			this.brillo -= 0.004;
		}
	}
	this.colision = function()
	{
		if(this.y >= 0)
		{
			this.y = 0;
			this.bajado = true;
		}
		else if(this.y <= -((this.sh/2 + 25)*2)+70)
		{
			this.y = -((this.sh/2 + 25)*2)+70;
		}
	}
	this.abrirse = function()
	{
		if(this.bajado)
		{
			if(this.apertura < 35)
			{
				this.apertura += 2;
			}
		}
		else
		{
			if(this.apertura != 0)
			{
				this.apertura -= 2;
			}
		}
	}
}