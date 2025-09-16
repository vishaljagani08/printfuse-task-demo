<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['name', 'address', 'industry', 'user_id'];
    protected $appends = ['is_active'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // set attribute to check if company is active for the authenticated user
    public function getIsActiveAttribute()
    {
        return $this->UserActiveCompany ? true : false;
    }

    public function UserActiveCompany()
    {
        return $this->hasOne(UserActiveCompany::class, 'company_id', 'id')
                    ->where('user_id', auth()->id());
    }
}
