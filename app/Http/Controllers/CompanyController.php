<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\UserActiveCompany;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $per_page = $request->input('per_page', 10);

        $companyQuery = Company::where('user_id', auth()->id())
        ->select('id', 'name', 'address', 'industry', 'created_at', 'updated_at');
        
        $companyData = $companyQuery->latest()->paginate($per_page);
        
        return Inertia::render('company/index', [
            'total_items'   => $companyData->total(),
            'per_page'      => $companyData->perPage(),
            'current_page'   => $companyData->currentPage(),
            'total_pages'    => $companyData->lastPage(),
            'company_data' => $companyData,
        ]);
    }

    public function create()
    {
        return Inertia::render('company/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'industry' => 'required|string'
        ]);

        Company::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'address' => $request->address,
            'industry' => $request->industry
        ]);

        return redirect()->route('company.index');
    }

    public function edit(Company $Company)
    {
        return Inertia::render('company/edit', [
            'company' => $Company
        ]);
    }

    public function update($id, Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'industry' => 'required|string'
        ]);

        $company = Company::findOrFail($id);

        if ($company) {
            $company->name = $request->name;
            $company->address = $request->address;
            $company->industry = $request->industry;
            $company->save();

            return redirect()->route('company.index');
        } else {
            return response()->json([
                'message' => 'Company not found'
            ], 404);
        }
    }

    public function destroy($id)
    {
        Company::find($id)->delete();
        return redirect()->back();
    }

    public function toggleStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,in_active',
        ]);

        $company = Company::find($id);
        if($company){
            if($request->status == 'in_active'){
                UserActiveCompany::where('user_id', auth()->id())
                    ->where('company_id', $company->id)
                    ->delete();
                return response()->json([
                    'message' => 'Company status updated successfully',
                    'data'=>['is_active' => false]
                ]);
            }else{
                $existing = UserActiveCompany::where('user_id', auth()->id())
                    ->where('company_id', $company->id)
                    ->first();
                if($existing){
                    return response()->json([
                        'message' => 'Company is already active',
                    ]);
                }else{
                    UserActiveCompany::create([
                        'user_id' => auth()->id(),
                        'company_id' => $company->id,
                    ]);

                    return response()->json([
                        'message' => 'Company status updated successfully',
                        'data'=>['is_active' => true]
                    ]);
                }
            }
        }else{
            return response()->json([
                'message' => 'Company not found',
            ], 404);
        }
    }
}
